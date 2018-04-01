/*
---------------------------------------------
MAIN
---------------------------------------------
*/

// General
var scriptTitle = "Atlas 0.0.0 / Hubris / 2017";
var activeDoc = HUBRIS.Documents.GetActiveDocument();
var atlasGUI;

// Settings
var atlasSettings;
var atlasData = new AtlasData;

var mapLayers = [];

// Scripting
HUBRIS.BridgeTalk.Setup();
// var bridgeTalk;
var consoleDisplay;

if (activeDoc != null)
{
    HUBRIS.GUI.ClearWindow(scriptTitle);
    atlasGUI = CreateGUI(scriptTitle);
    atlasGUI.show();

    HUBRIS.BridgeTalk.Message("Init()", "illustrator");
}

// INIT
function Init()
{
    // LOAD SETTINGS
    atlasSettings = HUBRIS.Settings.GetUserSettings("Atlas-UserData");

    if (atlasSettings == null)
    {
        atlasSettings = new AtlasSettings;

        var promptMessage = "This is your first time using Atlas. Please select \'NVC_Atlas-ParsedData\' folder.";
        atlasSettings.dataFolder = HUBRIS.Data.SetFolder(promptMessage);
        
        if (atlasSettings.dataFolder != null) HUBRIS.Settings.SaveUserSettings("Atlas-UserData", JSON.stringify(atlasSettings));
        else 
        {
            atlasGUI.close();
            HUBRIS.GUI.ClearWindow(scriptTitle);
            throw '';
        }
    }
    
    // LOAD DATA
    for(key in atlasData)
    {
        atlasData[key] = HUBRIS.Data.LoadData(atlasSettings.dataFolder, key);
        if (atlasData[key] == null)
        {
            beep();
            alert(key + " JSON file missing from data folder.");
        }
    } 
    
    mapObject = ParseData("Map1");
    UpdateGUIList(mapList, mapObject);

    graph1Object = ParseData("Graph1");
    UpdateGUIList(graph1List, graph1Object);

    graph2Object = ParseData("Graph2");
    UpdateGUIList(graph2List, graph2Object);

    graph3Object = ParseData("Graph3");
    UpdateGUIList(graph3List, graph3Object);

    
    var countryNameList = [];

    for (var i = 0; i < atlasData.NUTSStructure.NUTS.length; i++)
    {
        for (var ii = 0; ii < atlasData.NUTSStructure.NUTS[i].region.length; ii++)
        {
            countryNameList.push(atlasData.NUTSStructure.NUTS[i].region[ii]);
        }
    } 

    mapLayers = HUBRIS.Layers.GetLayersByName(activeDoc.layers, countryNameList, 1);
    if (mapLayers.length != 269) HUBRIS.Logger.ToConsole(mapLayers.length, "Error");    
}
