/*
---------------------------------------------
NUTS
---------------------------------------------
*/

function ParseData(typeOfData)
{
  var jsonsInFolder = new Folder(atlasSettings.dataFolder);
  var dataObject = { data : [], name : [], ai : [] };
  var dataFiles = jsonsInFolder.getFiles("*-" + typeOfData + "-**-Data.json");
  dataFiles.sort();
  var aiFiles = jsonsInFolder.getFiles("*-" + typeOfData + "-**-Export.ai");
  dataFiles.sort();

  for(var i = 0; i < dataFiles.length; i++)
  {
    var dataEnd = HUBRIS.Math.GetNthOccurance(dataFiles[i].name, '-', 5);
    var dataFilename = dataFiles[i].name.substring(0, dataEnd);

    dataObject.data[i] = dataFilename;

    // var nameStart = HUBRIS.Math.GetNthOccurance(dataFiles[i].name, '-', 3);
    var nameStart = -1;
    var nameEnd = HUBRIS.Math.GetNthOccurance(dataFiles[i].name, '-', 4);
    var onlyName = dataFiles[i].name.substring(nameStart + 1, nameEnd);
    onlyName = onlyName.replace(/_/g, " ");
    if (onlyName.length > 40) 
    {
      onlyName = onlyName.substring(0, 45);
      onlyName += "...";
    }
    dataObject.name[i] = onlyName;
    dataObject.ai[i] = CheckComponents(aiFiles, dataFilename);
  }

  HUBRIS.Logger.ToConsole("");
  HUBRIS.Logger.ToConsole(typeOfData + ": " + dataFiles.length + " data files, with " + aiFiles.length + " AIs.");

  return dataObject;
}

function CheckComponents(array, dataFilename)
{
  for(var i = 0; i < array.length; i++)
  {
    var last = HUBRIS.Math.GetNthOccurance(array[i].name, '-', 5);
    var fileName = array[i].name.substring(0, last);
    if (dataFilename == fileName) return true;
  }

  return false;
}

function GetCountryCode(layerName)
{
  var countryCode = layerName.substr(0, 2);
  return countryCode;
}

function CompareToCountries(layerName)
{
  for (var i = 0; i < atlasData.NUTSStructure.NUTS.length; i++)
  {
    if (layerName == atlasData.NUTSStructure.NUTS[i].country) return i;
  }

  return -1;
}

function CompareToRegions(layerName, regionIndex)
{
  var countryOutline = GetCountryCode(atlasData.NUTSStructure.NUTS[regionIndex].region[0]) + "-OUTLINE";
  if (layerName == countryOutline) return true;

  for (var i = 0; i < atlasData.NUTSStructure.NUTS[regionIndex].region.length; i++)
  {
    if (layerName == atlasData.NUTSStructure.NUTS[regionIndex].region[i]) return true;
  }

  return false;
}

function GetRegionToClass(chapterNumber, mapData, mapMin, mapMax)
{
  var mapClasses = [];
  if (mapMin >= 0) mapClasses.push(0);
  else mapClasses.push(Math.floor(mapMin));

  for (var i = 0; i < mapData.table.length; i++)
  {
    if (mapData.table[i].Classes != "") mapClasses.push(mapData.table[i].Classes);
    else break;
  }

  var regionToClass = [];
  var isAnyClassWrong = false;

  for (var i = 0; i < mapData.table.length; i++)
  {
    var thisClass = GetClass(mapClasses, mapData.table[i].Field, mapMin);
    if (thisClass == -1)
    {
      if (isAnyClassWrong == false) HUBRIS.Logger.ToConsole("");
      isAnyClassWrong = true;
      HUBRIS.Logger.ToConsole(mapData.table[i].NUTS + " class is out of range: " + mapData.table[i].Field + " of " + mapMin + " / " + mapMax);
    }
    
    if (chapterNumber == "Chapter3" || chapterNumber == "Chapter1") regionToClass.push(thisClass);
    else regionToClass.push(Math.floor(thisClass / 2));
  }

    HUBRIS.Logger.ToConsole("MapClasses #: " + mapClasses.length);
    HUBRIS.Logger.ToConsole("RegionToClass #: " + regionToClass.length);

    if (isAnyClassWrong) return null;
    return regionToClass;
}

function GetClass(classes, value, min)
{
  var classToReturn = -1;

  for (var i = 0; i <= classes.length; i++)
  {
    if (value > classes[i] && value <= classes[i + 1])
    {
      classToReturn = i;
      break;
    }

    else if (value == min) 
    {
      classToReturn = i;
      break;
    }
  }

  return classToReturn;
}

function GetDataName(dataObject, currentMapData)
{
  var mapID = currentMapData.substring(0, HUBRIS.Math.GetNthOccurance(currentMapData, '-', 2));
  var graphID = "";

  for (var i = 0; i < dataObject.data.length; i++)
  {
    if (dataObject.data[i].indexOf(mapID) != -1)
      {
        HUBRIS.Logger.ToConsole("GetDataName: " + dataObject.data[i]);
        graphID = dataObject.data[i];
      }
  }

  return graphID;
}

function GetDataName2(dataObject, currentMapData, currentDataSet)
{
  var mapID = currentMapData.substring(0, HUBRIS.Math.GetNthOccurance(currentMapData, '-', 2));
  var graphID = "";

  for (var i = 0; i < dataObject.data.length; i++)
  {
    if (dataObject.data[i].indexOf(mapID) != -1 && dataObject.data[i].indexOf(currentDataSet) != -1) graphID = dataObject.data[i];
  }

  return graphID;
}
