import { Flags } from './flags.enum';
import { Config } from './config.enum';
import { Common } from '@core/web-core';

export const AppConfig = { 
    // All boolean variable default value assigned
    [Flags.TreeView] : false,
    [Flags.IsShowDiv] : false,
    [Flags.GridDisable] : false,
    [Flags.SelectAllcheck] : false,
    [Flags.IsBulkUpdate] : false,
    [Flags.CheckForDownloadReport]:false,
    [Flags.FlagForTdsForm] : false,
    [Flags.CheckPreviewData] : false,
    [Flags.IsHidePrintbtn] : false,
    [Flags.UpdateGridData] : false,
    [Flags.PageLoading] : true,
    [Flags.CreateFilterFormgroup] : true,
    [Flags.CreateFilterHeadElement] : true,
    [Flags.UpdateNotification] : true,

    //All configuration varaiable default value assigned
    [Config.Fixedcolwidth] : 150,
    [Config.SortingColumnName] : null,
    [Config.PageSizes] : [25, 50, 75, 100, 200],
    [Config.OrderBy] : '-',
    [Config.PageNumber] : Common.PAGE_NO,
    [Config.Total] : 0,    
    [Config.ItemNumOfGrid] : null,
    [Config.CurrentMenu] : {},
    [Config.SortIcon] : 'down',
    [Config.Filterdata] : '',
    [Config.RowSelectionIndex] : 0,
    [Config.SelectedRowIndex] : -1,
    [Config.EditedRowIndex] : -1,
    [Config.ColumnSelectionIndex] : -1,
    [Config.CurrentRowIndex] : -1,
    [Config.FormName] : '',
    [Config.SelectContactAdd] : '',
    [Config.CurrentBrowseUrl] : '',
    [Config.RecordId] : '',
    [Config.RowId] : '',
    [Config.MenuTopLeftPosition] : {x: '0', y: '0'},
    [Config.DownloadPdfCheck] : '',
    [Config.DownloadQRCode] : '',
    [Config.SelectedViewRowIndex] : -1,
    [Config.ViewColumnName] : '',
    [Config.EditedRowCopyData] : {},
    [Config.SelectedRowData] : {},
    [Config.UserInfo] : {},
    [Config.HeadElements] : [],
    [Config.GridButtons] : [],
    [Config.ActionButtons] : {},
    [Config.Elements] : [],
    [Config.ModifyGridData] : [],
    [Config.Tabs] : [],
    [Config.Tab] : {},
    [Config.BulkuploadList] : [],
    [Config.TreeViewData] : {},
    [Config.CurTreeViewField] : {},
    [Config.StaticData] : {},
    [Config.CopyStaticData] : {},
    [Config.TypeAheadData] : [],
    [Config.Details] : {},
    [Config.Dinamic_form] : {},
    [Config.TableFields] : [],
    [Config.QueryParams] : {},
    [Config.TabFilterData] : [],
    [Config.TypegrapyCriteriaList] : [],
    [Config.PreviewData] : '',
    [Config.downloadClick] : ''
 };

 export interface AppConfigInterface {
    treeView:boolean,
    isShowDiv:boolean,
    gridDisable:boolean,
    selectAllcheck:boolean,
    isBulkUpdate:boolean,
    checkForDownloadReport:boolean,
    flagForTdsForm:boolean,
    checkPreviewData:boolean,
    isHidePrintbtn:boolean,
    updateGridData:boolean,
    pageLoading:boolean,
    createFilterFormgroup:boolean,
    createFilterHeadElement:boolean,
    updateNotification:boolean,

    fixedcolwidth:any,
    sortingColumnName:any,
    pageSizes:any,
    orderBy:any,
    pageNumber:any,
    total:any,
    itemNumOfGrid:any,
    currentMenu:any,
    sortIcon:any,
    filterdata:any,
    rowSelectionIndex:any,
    selectedRowIndex:any,
    editedRowIndex:any,
    columnSelectionIndex:any,
    currentRowIndex:any,
    formName:any,
    selectContactAdd:any,
    currentBrowseUrl:any,
    recordId:any,
    rowId:any,
    menuTopLeftPosition:any,
    downloadPdfCheck:any,
    downloadQRCode:any,
    selectedViewRowIndex:any,
    viewColumnName:any,
    editedRowCopyData:any,
    selectedRowData:any,
    userInfo:any,
    headElements:any,
    gridButtons:any,
    actionButtons:any,
    elements:any,
    modifyGridData:any,
    tabs:any,
    tab:any,
    bulkuploadList:any,
    treeViewData:any,
    curTreeViewField:any,
    staticData:any,
    copyStaticData:any,
    typeAheadData:any,
    details:any,
    dinamic_form:any,
    tableFields:any,
    queryParams:any,
    tabFilterData:any,
    typegrapyCriteriaList:any,
    previewData:any,
    downloadClick:any
  }