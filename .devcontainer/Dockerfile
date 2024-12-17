ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000

FROM mcr.microsoft.com/dotnet/sdk:8.0

# Create the user
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid 1000 -m vscode

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install npm libice6 libsm6 libfontconfig1

USER vscode

CMD /bin/bash