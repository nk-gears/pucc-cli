# PUCC Cli (WIP)

Power Up Custom Connector CLI

Makes Custom Connector Authoring a Joyful one via Cli - Targetted for Power Automate - Custom Connectors 

Note : can also be used for 2.0 swagger authoring

### Work in Progress

### Why this ?

Authoring and Publishing OpenAPI are not that much Complex when working few REST API Paths. But as the api grows large, this has become cumbersome in managing everything in one single file.

This issue already addressed by multipe tools, openapi-cli, redoc-cli (redocly). Then even support to split an existing file and bundle them again to a single openapi yaml/json file.

But all these tools focus on Swagger 3.0. At this time of writing, they don't support 2.0. I work in open source project where it demands 2.0 only

# What does it do ?

- Easily Author OpenAPI by keeping the file separate across different folders for each resource operations/actions
- Definitions, Parameters are kept separately.


```

.
├── README.md
├── package.json
├── src
│   ├── connectors
│   │   ├── freeagent
│   │   │   ├── base
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
│   │   │       │   ├── get-GetContacts\ copy.json
│   │   │       │   └── post-CreateContact.json
│   │   │       └── invoices
│   │   └── neto
│   └── docs


```



# Features

- [ ] Split a OpenAPI file to a folder
- [ ] Build a OpenAPI file from a Individual files
- [ ] Validate the file using Validation
- [ ] Create Output file for PACONN Upload



# Usage

```




```

# Motivation

I have been working on building custom connectors for more than a year and i faced the challened of developing the swagger.json file manually for a API which has almost 200+ resources. It's practically impossible to scroll through a 10K lines of swagger file.

This is mainly targetted for developing connectors for the Power Automate Custom Connectors. But can be used in generic way to split and bundle.


# Contributors

Contributors welcome. Please send a PR or open a Issue if needed.



