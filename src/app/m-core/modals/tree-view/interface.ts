/**
 * Node for to-do item
 */
 export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
    reference:any;
    pId:string;
    pIndex:string;
    _id:string;
    action:any;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {  
    item: string;
    level: number;
    expandable: boolean;
    reference:any;
    type:string;
    pId:string;
    pIndex:string;
    _id:string;
    action:any;
  }
  
  export const defaultselectedData = {
    "DEVLP": {
      "reference": {
        "_id": "5f910a5dddbddf709cb081cb",
        "name": "DEVLP"
      },
      "menus": {
        "Menu": {
          "reference": {
            "_id": "618415dbbbd19278af0295b9",
            "name": "Menu",
            "allSelected": true,
            "select": true
          },
          "templateTabs": {
            "Module Menu": {
              "reference": {
                "code": "TT-10",
                "_id": "5fd757920e6d87146aeeeca2",
                "name": "Module Menu",
                "select": true
              }
            }
          }
        },
        "Modules": {
          "reference": {
            "_id": "61841592bbd19278af0295b7",
            "name": "Modules",
            "allSelected": true,
            "select": true
          },
          "templateTabs": {
            "modulesTab": {
              "reference": {
                "code": "TT-9",
                "_id": "5fd7503d0e6d87146aeea4b4",
                "name": "modulesTab",
                "select": true
              }
            }
          }
        },
        "Other Masters": {
          "reference": {
            "_id": "5f6b38b224955ff44662081c",
            "name": "Other Masters"
          },
          "submenus": {
            "Core Permissions": {
              "reference": {
                "_id": "62bc1e20591b2a44672a15bc",
                "name": "Core Permissions",
                "allSelected": true,
                "select": true
              },
              "templateTabs": {
                "Core Permissions": {
                  "reference": {
                    "code": "TT-18",
                    "_id": "62bc184b591b2a446727ffd2",
                    "name": "Core Permissions",
                    "select": true
                  }
                }
              }
            },
            "Permission Module": {
              "reference": {
                "_id": "64788afe51d27c774972b501",
                "name": "Permission Module"
              },
              "templateTabs": {
                "App Role": {
                  "reference": {
                    "code": "TT-5",
                    "_id": "64787e6251d27c774972a374",
                    "name": "App Role",
                    "version": 2,
                    "select": true
                  }
                }
              }
            },
            "Pojo Master": {
              "reference": {
                "_id": "5fd87e4f0e6d87146af2a8b5",
                "name": "Pojo Master"
              },
              "templateTabs": {
                "Pojo Master Tab": {
                  "reference": {
                    "code": "TT-2",
                    "_id": "5fe1ac0107f523408d82b851",
                    "name": "Pojo Master Tab",
                    "select": true
                  }
                }
              }
            }
          }
        },
        "Template": {
          "reference": {
            "_id": "6184301c1529d275fcda9fee",
            "name": "Template"
          },
          "templateTabs": {
            "Step-4 Grid": {
              "reference": {
                "_id": "5f99992206e39d21d8fca81b",
                "name": "Step-4 Grid",
                "select": true
              }
            }
          }
        }
      }
    },
    "IAM": {
      "reference": {
        "_id": "5fb28a93d28c3e1c2a3f8b6a",
        "name": "IAM"
      },
      "menus": {
        "Role & Permission": {
          "reference": {
            "_id": "6186175767a48e17d4a394a7",
            "name": "Role & Permission"
          },
          "submenus": {
            "Role": {
              "reference": {
                "_id": "6186175767a48e17d4a394aa",
                "name": "Role"
              },
              "templateTabs": {
                "User Group": {
                  "reference": {
                    "code": "TT-4",
                    "_id": "6186185167a48e17d4a3afe8",
                    "name": "User Group",
                    "select": true
                  }
                }
              }
            }
          }
        }
      }
    },
    "TKM": {
      "reference": {
        "_id": "64881a64dd15d707bec33314",
        "name": "TKM"
      },
      "menus": {
        "Assigned Tasks": {
          "reference": {
            "_id": "64902e3b39a4b43e738c4706",
            "name": "Assigned Tasks"
          },
          "templateTabs": {
            "Task Management Opened Task Tab": {
              "reference": {
                "code": "TT-14",
                "_id": "6489b8bbb72a8c0535f52d49",
                "name": "Task Management Opened Task Tab",
                "version": 4,
                "select": true
              }
            }
          }
        }
      }
    }
  }