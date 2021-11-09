# PUCC Cli (WIP)


<img src="https://user-images.githubusercontent.com/897323/140926131-c98f8614-0a67-4777-a3c2-a7c78c3954b1.png" width=100 />


Power Up (your) Custom Connector -  CLI

Makes Custom Connector Authoring a Joyful one via Cli - Targetted for Power Automate - Custom Connectors 

### Why this ?

Authoring and Publishing OpenAPI are not that much Complex when working few REST API Paths. But as the api grows large, this has been a cumbersome in managing everything in one single file.

This issue already addressed by multipe tools, openapi-cli, redoc-cli (redocly). Then even support to split an existing file and bundle them again to a single openapi yaml/json file.

But all these tools focus on Swagger 3.0. At this time of writing, they don't support 2.0. Currently Custom Connectors in Power Automate supports Swagger 2.0 only

# What does it do ?

- Easily Author OpenAPI by keeping the file separate across different folders for each resource operations/actions
- Definitions, Parameters are kept separately.

# Features in v1.0

- [ ] Create a New Custom Connector Files (supports remote creation as well)
- [ ] Split a OpenAPI file to a folder
- [ ] Build a OpenAPI file from a Individual files
- [ ] Validate the file using Validation
- [ ] Deploy the connector to the Power Automate Platform.
- [ ] Add a Policy  Template to an Action
- [ ] Add a New Action with Interactive user Prompts
- [ ] Add a New Trigger
- [ ] Add a Connection
- [ ] Add a Policy
- [ ] Add a Capability
- [ ] Convert a Clipboard JSON Content to Pastable Schema

### Features in Roadmap

- [ ] Support to Split Large Connection Operations to Separate Groups
- [ ] Support CI/CD Workflow for deploying the connector to specific environment
- Supports Versioning



# Work in Progress

- [ ] pucc create
- [x] pucc split
- [ ] pucc build
- [ ] pucc validate
- [ ] pucc deploy
- [ ] pucc add-policy
- [ ] pucc add-action
    - [ ] method : get
    - [ ] path:
    - [ ] operation: SomeOperationName
    - [ ] parameters: userId,Name,title
    - [ ] response_schema:
- [ ] pucc add-trigger
- [ ] pucc add-connection
- [ ] pucc schema -c
- [ ] pucc add-policy
    - [ ] Listing all Policies


### Folder Structure Created by PUCC CLI

```

│   ├── connectors
│   │   ├── freeagent
│   │   │   ├── basemeta
│   │   │   │   ├── freagent.properties.json
│   │   │   │   ├── freeagent.base.json
│   │   │   │   └── icon.png
│   │   │   ├── definitions
│   │   │   │   └── createSubscriptionReqDto.json
│   │   │   ├── parameters
│   │   │   │   └── projectStage.json
│   │   │   ├── policies
│   │   │   │   └── default.json
│   │   │   └── resources
│   │   │       ├── contacts
│   │   │       │   ├── get-GetContacts copy.json
│   │   │       │   └── post-CreateContact.json


```




## Usage

## Split Connector

```
 pucc split --sourceFolderPath "/Users/NirmalK/projects/microsoft/pucc-cli/shared_freeagent-5f9efd50f3eb6b19ac-5fa7ba4a50058013f4"  --targetFolderPath "/Users/NirmalK/projects/microsoft/pucc-cli/connectors/freeagent" --name freeagent

```


## Build Connector

```
 pucc build --sourceFolderPath "/Users/NirmalK/projects/microsoft/pucc-cli/connectors/freeagent" --name freeagent

```

## Create New Connector

```

```

## Deploy or Update a Connector


## Validate a Connector









# Motivation

I have been working on building custom connectors for more than a year and i faced the challened of developing the swagger.json file manually for a API which has almost 200+ resources. It's practically impossible to scroll through a 10K lines of swagger file.

This is mainly targetted for developing connectors for the Power Automate Custom Connectors. But can be used in generic way to split and bundle.


# Contributors

Contributors welcome. Please send a PR or open a Issue if needed.


