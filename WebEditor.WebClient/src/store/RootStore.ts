import { makeAutoObservable } from "mobx";
import MapTool from "../model/MapTool";
import { RoadCustomization } from "../model/RoadCustomization";
import { RoadCustomizationDTO, RoadCustomizationStorageDTO, RoadNetworkCustomizationDTO } from "../model/RoadCustomizationDTO";
import { Session } from "../model/Session";
import { ApiRequester } from "../api/ApiRequester";

class RootStore {
  year: number = 2024;
  tools: MapTool[] | null = null;
  currentTool: MapTool | null = null;
  lastToolId: string = "Pan";
  customizations: RoadCustomization[] = [];
  session: Session;
  loading: boolean = false;

  constructor() {
    this.session = new Session(this);
    makeAutoObservable(this);
  }

  setYear(year: number) {
    this.year = year;
  }

  setCurrentTool(tool: MapTool) {
    this.currentTool = tool;
  }

  setTools(tools: MapTool[]) {
    this.tools = tools;
  }

  setLoading(isLoading: boolean)
  {
    this.loading = isLoading;
  }

  saveCustomizations() {
    const list: RoadCustomizationStorageDTO[] = [];
    this.customizations.forEach(item => list.push(item.toStorageDTO()));
    localStorage.setItem('roadCustomizations', JSON.stringify(list));
  }

  async syncCustomizations() {
    const list: RoadCustomizationDTO[] = [];

    for (let i = 0; i < this.customizations.length; i++) {
      list.push(this.customizations[i].toDTO());
    }

    let dto: RoadNetworkCustomizationDTO = {
      year: this.year,
      roadCustomizations: list
    }

    return new ApiRequester(this).updateCustomization(dto);
  }

  async loadCustomizations() {
    this.setLoading(true);

    this.customizations.length = 0;
    const json: string | null = localStorage.getItem('roadCustomizations');
    if (json != null) {
      const storageDTO: RoadCustomizationStorageDTO[] = JSON.parse(json);
      storageDTO.forEach((item: RoadCustomizationStorageDTO) => this.customizations.push(RoadCustomization.fromStorageDTO(item)));
      for (let i = 0; i < this.customizations.length; i++)
        this.customizations[i].id = i;
      await this.syncCustomizations();
    }
    this.setLoading(false);
  }

  async syncCustomizationArray(customizations: RoadCustomization[], setLoading: boolean = true) {
    if(setLoading)
      this.setLoading(true);
    const list: RoadCustomizationDTO[] = [];

    for (let i = 0; i < customizations.length; i++) {
      list.push(customizations[i].toDTO());
    }

    let dto: RoadNetworkCustomizationDTO = {
      year: this.year,
      roadCustomizations: list
    }

    await new ApiRequester(this).updateCustomization(dto);
    if(setLoading)
      this.setLoading(false);
  }


  async clearCustomizationSession(setLoading: boolean = true) {
    if(setLoading)
      this.setLoading(true);
    let dto: RoadNetworkCustomizationDTO = {
      year: this.year,
      roadCustomizations: []
    }

    await new ApiRequester(this).updateCustomization(dto);
    if(setLoading)
      this.setLoading(false);
  }

  async newProject() {
    this.setLoading(true);

    this.customizations.length = 0;
    localStorage.setItem('roadCustomizations', JSON.stringify([]));
    await this.syncCustomizations();
    this.updateToolAndMap();
    this.unloadMapTools();
    this.setLoading(false);
  }

  async saveProject() {
    const project: RoadCustomizationStorageDTO[] = [];
    this.customizations.forEach(item => project.push(item.toStorageDTO()));
    const jsonStr = JSON.stringify(project);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Projekt_${this.year}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async loadProject(project: RoadCustomizationStorageDTO[]) {
    this.setLoading(true);
    this.customizations.length = 0;
    project.forEach((item: RoadCustomizationStorageDTO) => this.customizations.push(RoadCustomization.fromStorageDTO(item)));
    for (let i = 0; i < this.customizations.length; i++)
      this.customizations[i].id = i;
    this.saveCustomizations();
    await this.syncCustomizations();
    this.updateToolAndMap();
    this.unloadMapTools();
    this.setLoading(false);
  }

  updateToolAndMap() {
    const roadCustomizationsTool = this.getTool("RoadCustomizations");
    if(this.currentTool?.id != roadCustomizationsTool?.id)
      roadCustomizationsTool!.refresh();
  }

  unloadMapTools() {
    if(this.tools)
    {
      for (let i = 0; i < this.tools.length; i++) {
          this.tools[i].unLoad();
      }
    }
  }

  async addCustomization(customization: RoadCustomization) {
    this.setLoading(true);
    const id = this.customizations.length;
    customization.id = id;
    this.customizations.push(customization);
    this.saveCustomizations();
    await this.syncCustomizations();
    this.updateToolAndMap();
    this.setLoading(false);
  }

  async removeCustomization(index: number) {
    this.setLoading(true);
    this.customizations.splice(index, 1);
    for (let i = 0; i < this.customizations.length; i++)
      this.customizations[i].id = i;
    this.saveCustomizations();
    await this.syncCustomizations();
    this.updateToolAndMap();
    this.setLoading(false);
  };

  switchTool(toolId: string, arg: RoadCustomization | null) {
    const nextTool = this.getTool(toolId);
    if (nextTool) {
      if (nextTool.isSelectionTool()) {
        if (toolId != this.lastToolId) {
          const lastTool = this.getTool(this.lastToolId);
          lastTool?.unLoad();
          this.lastToolId = toolId;
        }
      }
      this.currentTool = nextTool;
      if (arg != null)
        this.currentTool.load(arg);
    }
  }

  getTool(toolId: string) {
    if (this.tools) {
      for (let i = 0; i < this.tools.length; i++) {
        if (this.tools[i].id == toolId) {
          return this.tools[i];
        }
      }
    }
  }

}

const rootStore = new RootStore();
export type { RootStore };
export { rootStore };