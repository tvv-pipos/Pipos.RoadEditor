import { makeAutoObservable } from "mobx";
import { RootStore } from "../store/RootStore";

class Session {
  id: string | null;
  loading: boolean;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.loading = true;
    this.id = null;
    makeAutoObservable(this);

    this.rootStore = rootStore;
    if(this.id == null)
      this.refresh();
  }

  login(username:string, password:string) {
    fetch('/api/login/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          this.setSession(null);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.hasSession) {
          this.setSession(data.id);
          this.rootStore.loadCustomizations();
        } else {
          this.setSession(null);
        }
      })
      .catch((error) => {
        this.setSession(null);
        console.log(`Login failed. ${error.message}`);
      });
  }

  refresh() {
    fetch('/api/login/refresh', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          this.setSession(null);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.hasSession) {
          this.setSession(data.id);
          this.rootStore.loadCustomizations();
        } else {
          this.setSession(null);
        }
      })
      .catch((error) => {
        console.log(`Login failed. ${error.message}`);
        this.setSession(null);
      });
  }
  
  setSession(sessionId: string | null) {
    this.id = sessionId;
    this.loading = false;
  }


}

export { Session };