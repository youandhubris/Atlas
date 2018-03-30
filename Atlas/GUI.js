/*
---------------------------------------------
GUI
---------------------------------------------
*/

function CreateGUI(title)
{    
    var gui = new Window("palette", title);
    gui.location = [200, 200];
    gui.orientation = "column";

    // Tab Panel
    var tabPanel = gui.add ("tabbedpanel");
    tabPanel.alignChildren = ["fill", "fill"];
    tabPanel.preferredSize = [350, 300];

        // Map Tab
        var mapTab = tabPanel.add ("tab", undefined, "Map");
        mapTab.alignChildren = "fill";

            mapList = mapTab.add ("listbox", undefined, "", {multiselect: true, numberOfColumns: 2, showHeaders: true, columnTitles: ["Name", "Ai"]});
            mapList.preferredSize = [350, 250];

            var buttonApplyData = mapTab.add("button", [0, 0, 250, 30], "Apply Data");
            
            buttonApplyData.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("ApplyData()", "illustrator");
            };

            var buttonSaveAsAi = mapTab.add("button", undefined, "Save As...");
            
            buttonSaveAsAi.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("HUBRIS.Export.SaveAsAI()", "illustrator");
            };

            var buttonBatchApplySaveData = mapTab.add("button", undefined, "Batch Apply Data & Save As...");
            
            buttonBatchApplySaveData.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("BatchApplySaveData()", "illustrator");
            };


    

        // Graph 1 Tab
        var graph1Tab = tabPanel.add ("tab", undefined, "Graph1");
        graph1Tab.alignChildren = "fill";

            graph1List = graph1Tab.add ("listbox", undefined, "", {numberOfColumns: 2, showHeaders: true, columnTitles: ["Name", "Ai"]});
            graph1List.preferredSize = [350, 250];


         // Graph 2 Tab
        var graph2Tab = tabPanel.add ("tab", undefined, "Graph2");
        graph2Tab.alignChildren = "fill";

            graph2List = graph2Tab.add ("listbox", undefined, "", {numberOfColumns: 2, showHeaders: true, columnTitles: ["Name", "Ai"]});
            graph2List.preferredSize = [350, 250];

        // Graph 3 Tab
        var graph3Tab = tabPanel.add ("tab", undefined, "Graph3");
        graph3Tab.alignChildren = "fill";

            graph3List = graph3Tab.add ("listbox", undefined, "", {numberOfColumns: 2, showHeaders: true, columnTitles: ["Name", "Ai"]});
            graph3List.preferredSize = [350, 250];

        // Settings Tab
        var settingsTab = tabPanel.add ("tab", undefined, "Settings");
        settingsTab.alignChildren = "fill";

            var generalSettings = settingsTab.add("panel", [0, 0, 370, 60], "General");
            var buttonSetDataFolder = generalSettings.add("button", [0, 0, 250, 30], "Set Data Folder");
            
            var mapSettings = settingsTab.add("panel", [0, 0, 370, 140], "Map");
            var buttonCreateMapLayers = mapSettings.add("button", [0, 0, 250, 30], "Create Map Layers");
            var buttonVerifyMapLayers = mapSettings.add("button", [0, 0, 250, 30], "Verify Map Layers");
            var buttonUpdateMapList = mapSettings.add("button", [0, 0, 250, 30], "Update Map List");

            // Set Data Folder Actions
            buttonSetDataFolder.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("SetUserSettingsFolder(\"Please select \'NVC_Atlas-ParsedData\' folder.\")", "illustrator");
                HUBRIS.Documents.BridgeTalkMessage("Init()", "illustrator");
            };

            // Map Actions
            buttonCreateMapLayers.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("CreateMapLayers()", "illustrator");
            };

            buttonVerifyMapLayers.onClick = function()
            {
                HUBRIS.Documents.BridgeTalkMessage("VerifyMapLayers()", "illustrator");
            }

            buttonUpdateMapList.onClick = function()
            {
                // HUBRIS.Documents.BridgeTalkMessage("VerifyMapLayers()", "illustrator");
                mapObject = null;
                mapObject = ParseData("Map1");
                UpdateGUIList(mapList, mapObject);
            }

    // Console
    var consolePanel = gui.add("panel", [0, 0, 390, 200], "Console");
    consoleDisplay = consolePanel.add('edittext', [0, 10, 390, 200], '', {readonly: true, multiline: true, scrolling: true});
    consoleDisplay.margins = 0;
    consoleDisplay.spacing = 0;
    return gui;
}

function UpdateGUIList(guiList, dataObject)
{
    for(var i = guiList.items.length - 1; i >= 0; i--)
    {
        guiList.remove(guiList.items[i]);
    }

    for(var i = 0; i < dataObject.data.length; i++)
    {
        with (guiList.add("item", dataObject.name[i]))
        {
        if (dataObject.ai[i]) subItems[0].text = "X";
        }
    }
}

function ApplyData()
{
  mapSelection = parseInt(mapList.selection[0]);
  ProcessData(mapObject.data[mapSelection]);
}

function BatchApplySaveData()
{
  for (var i = 0; i < mapList.selection.length; i++)
  {
    mapSelection = parseInt(mapList.selection[i]);
    ProcessData(mapObject.data[mapSelection]);
    HUBRIS.Export.SaveAsAI();
    if (i < mapList.selection.length - 1) app.undo();
  }
}

function ProcessData(selection)
{
  HUBRIS.Logger.ToConsole("\nSTART APPLY DATA\n");


  // CHECK SELECTION
  var selectedFile = selection;

  HUBRIS.Logger.ToConsole("\nIndex: " + mapList.selection);
  HUBRIS.Logger.ToConsole("Selection: " + selectedFile);


  // CHECK CHAPTER
  var chapterNumber = "";
  if (selectedFile.indexOf("Chapter1") == 0) chapterNumber = "Chapter1";
  else if (selectedFile.indexOf("Chapter2") == 0) chapterNumber = "Chapter2";
  else if (selectedFile.indexOf("Chapter3") == 0) chapterNumber = "Chapter3";


  // GET SWATCHES
  var mapSwatchColors = HUBRIS.Color.GetSwatchArray("MapPalette");
  if (mapSwatchColors == null) throw alert("Wrong palette name.");
  else if (mapSwatchColors.length != 3) throw alert("Wrong # of colors. You have " + mapSwatchColors.length + ", instead of 3.");

  // GET JSON FILE
  var mapData = HUBRIS.Data.LoadData(atlasSettings.dataFolder, selectedFile + "-Data");


  // GET MIN, MAX
  var mapMin = mapData.table[0].Min;
  var mapMax = mapData.table[0].Max;


  // MANUAL AND FIXED
  var magentaClass = 0;
  var yellowClass = 4;
  var cyanClass = 9;


  // GET CLASSES
  var regionToClass = GetRegionToClass(chapterNumber, mapData, mapMin, mapMax);

  if (regionToClass != null)
  {
    var firstLevel = activeDoc.layers;

    if (chapterNumber == "Chapter2" || chapterNumber == "Chapter3")
    {
      DoDataTitle(selectedFile);
      DoMapCaption(mapData, chapterNumber);
    }
  
    ColorizeMap(chapterNumber, firstLevel, mapData, regionToClass, mapSwatchColors, magentaClass, yellowClass, cyanClass);

    if (chapterNumber == "Chapter2")
    {
      DoGraph1(selectedFile, firstLevel);
      DoGraph2(selectedFile, firstLevel, mapSwatchColors, magentaClass, yellowClass, cyanClass);
      DoGraph3(selectedFile, graph3Object, firstLevel, "Chapter2-Graph3");

      // var layersToRemove = ["Chapter3-Graph1", "Chapter3-Graph2"];
      // removeLayers(layersToRemove);
    }

    else if (chapterNumber == "Chapter3")
    {
      DoGraph4(selectedFile, mapData, graph1Object, firstLevel, mapSwatchColors);
      DoGraph3(selectedFile, graph2Object, firstLevel, "Chapter3-Graph2");

      // var layersToRemove = ["Chapter2-Graph1", "Chapter2-Graph2", "Chapter2-Graph3"];
      // removeLayers(layersToRemove);
    }
  }

  HUBRIS.Logger.ToConsole("\nEND APPLY DATA\n");
}
