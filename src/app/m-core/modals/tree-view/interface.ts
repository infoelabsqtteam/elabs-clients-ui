/**
 * Node for to-do item
 */
 export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
    reference:any;
    parentId:string;
    _id:string;
    allSelected:boolean;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {  
    item: string;
    level: number;
    expandable: boolean;
    reference:any;
    type:string;
    parentId:string;
    _id:string;
    allSelected:boolean;
  }

  export const newTreeData = {
    "DEVLP": {
        "reference": {
            "_id": "5f910a5dddbddf709cb081cb",
            "name": "DEVLP"
        },
        "menus": {
            "Menu": {
                "reference": {
                    "_id": "618415dbbbd19278af0295b9",
                    "name": "Menu"
                },
                "submenus": null,
                "templateTabs":{
                  "Alert Notification": {
                      "reference": {
                          "code": "TT-1",
                          "_id": "63a986ae1e435c4cbd82f269",
                          "name": "Alert Notification"
                      }
                  },
                  "Notification": {
                    "reference": {
                        "code": "TT-1",
                        "_id": "63a986ae1e435c4cbd82f270",
                        "name": "Notification"
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
                    "Alert Notification": {
                        "reference": {
                            "_id": "63a978ad740f152ff8c0ada5",
                            "name": "Alert Notification"
                        },
                        "templateTabs": {
                          "Alert Notification": {
                              "reference": {
                                  "code": "TT-1",
                                  "_id": "63a986ae1e435c4cbd82f271",
                                  "name": "Alert Notification"
                              }
                          },
                          "Notification": {
                            "reference": {
                                "code": "TT-1",
                                "_id": "63a986ae1e435c4cbd82f272",
                                "name": "Alert Notification"
                            }
                          },
                          "Notification Test": {
                            "reference": {
                                "code": "TT-1",
                                "_id": "63a986ae1e435c4cbd82f273",
                                "name": "Alert Notification"
                            }
                          }
                        }
                    },
                }
            },
        }
    },
  }
  export const keys = [
    "menus" , "submenus" , "templateTabs"
  ]
  export const useCases = [{
    data: [
      { item: "Risk Analysis", level: 0, expandable: true },
      { item: "Volatility", level: 1, expandable: true },
      { item: "Total", level: 2, expandable: false },
      { item: "Systematic", level: 2, expandable: false },
      { item: "Specific", level: 2, expandable: false },
      { item: "TaR (68%, 1 year)", level: 1, expandable: true },
      { item: "Total", level: 2, expandable: false },
      { item: "Systematic", level: 2, expandable: false },
      { item: "Specific", level: 2, expandable: false },
      { item: "VaR (95%, 2 weeks, Chebyshev)", level: 1, expandable: true },
      { item: "Total", level: 2, expandable: false },
      { item: "Systematic", level: 2, expandable: false },
      { item: "Specific", level: 2, expandable: false }
    ],
    expected: {
      "Risk Analysis": {
        "Volatility": ["Total", "Systematic", "Specific"],
        "TaR (68%, 1 year)": ["Total", "Systematic", "Specific"],
        "VaR (95%, 2 weeks, Chebyshev)": ["Total", "Systematic", "Specific"]
      }
    }
  }, {
    data: [
      { item: "Risk Analysis", level: 0, expandable: true },
      { item: "Standard", level: 1, expandable: true },
      { item: "Active", level: 2, expandable: true },
      { item: "Volatility", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false }
    ],
    expected: {
      "Risk Analysis": {
        "Standard": {
          "Active": {
            "Volatility": {
              "Contribution": [ "Total", "Systematic", "Specific" ]
            }
          }
        }
      }
    }
  }, {
    data: [
      { item: "Risk Analysis", level: 0, expandable: true },
      { item: "Standard", level: 1, expandable: true },
      { item: "Active", level: 2, expandable: true },
      { item: "Volatility", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false },
      { item: "VaR (95%, 2 weeks, Chebyshev)", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false },
      { item: "Benchmark", level: 2, expandable: true },
      { item: "Volatility", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false },
      { item: "VaR (95%, 2 weeks, Chebyshev)", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false },
      { item: "Portfolio", level: 2, expandable: true },
      { item: "Volatility", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false },
      { item: "VaR (95%, 2 weeks, Chebyshev)", level: 3, expandable: true },
      { item: "Contribution", level: 4, expandable: true },
      { item: "Total", level: 5, expandable: false },
      { item: "Systematic", level: 5, expandable: false },
      { item: "Specific", level: 5, expandable: false }
    ],
    expected: {
      "Risk Analysis": {
        "Standard": {
          "Active": {
            "Volatility": {
              "Contribution": ["Total", "Systematic", "Specific"]
            },
            "VaR (95%, 2 weeks, Chebyshev)": {
              "Contribution": ["Total", "Systematic", "Specific"]
            }
          },
          "Benchmark": {
            "Volatility": {
              "Contribution": ["Total", "Systematic", "Specific"]
            },
            "VaR (95%, 2 weeks, Chebyshev)": {
              "Contribution": ["Total", "Systematic", "Specific"]
            }
          },
          "Portfolio": {
            "Volatility": {
              "Contribution": ["Total", "Systematic", "Specific"]
            },
            "VaR (95%, 2 weeks, Chebyshev)": {
              "Contribution": ["Total", "Systematic", "Specific"]
            }
          },
        }
      }
    }
  },
{
    data:[
        {
            "item": "DEVLP",
            "level": 0,
            "expandable": true,
            "reference": {
                "_id": "5f910a5dddbddf709cb081cb",
                "name": "DEVLP"
            },
            "_id": "5f910a5dddbddf709cb081cb"
        },
        {
            "item": "Menu",
            "level": 1,
            "expandable": true,
            "reference": {
                "_id": "618415dbbbd19278af0295b9",
                "name": "Menu"
            },
            "_id": "618415dbbbd19278af0295b9",
            "parentId": "5f910a5dddbddf709cb081cb",
            "type": "menus"
        },
        {
            "item": "Alert Notification",
            "level": 2,
            "expandable": false,
            "reference": {
                "code": "TT-1",
                "_id": "63a986ae1e435c4cbd82f269",
                "name": "Alert Notification"
            },
            "_id": "63a986ae1e435c4cbd82f269",
            "parentId": "618415dbbbd19278af0295b9",
            "type": "templateTabs"
        },
        {
            "item": "Other Masters",
            "level": 1,
            "expandable": true,
            "reference": {
                "_id": "5f6b38b224955ff44662081c",
                "name": "Other Masters"
            },
            "_id": "5f6b38b224955ff44662081c",
            "parentId": "5f910a5dddbddf709cb081cb",
            "type": "menus"
        },
        {
            "item": "Alert Notification",
            "level": 2,
            "expandable": true,
            "reference": {
                "_id": "63a978ad740f152ff8c0ada5",
                "name": "Alert Notification"
            },
            "_id": "63a978ad740f152ff8c0ada5",
            "parentId": "5f6b38b224955ff44662081c",
            "type": "submenus"
        },
        {
            "item": "Notification",
            "level": 3,
            "expandable": false,
            "reference": {
                "code": "TT-1",
                "_id": "63a986ae1e435c4cbd82f272",
                "name": "Alert Notification"
            },
            "_id": "63a986ae1e435c4cbd82f272",
            "parentId": "63a978ad740f152ff8c0ada5",
            "type": "templateTabs"
        },
        {
            "item": "Notification Test",
            "level": 3,
            "expandable": false,
            "reference": {
                "code": "TT-1",
                "_id": "63a986ae1e435c4cbd82f273",
                "name": "Alert Notification"
            },
            "_id": "63a986ae1e435c4cbd82f273",
            "parentId": "63a978ad740f152ff8c0ada5",
            "type": "templateTabs"
        }
    ],
    expected:{}
}];