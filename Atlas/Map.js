/*
---------------------------------------------
MAP
---------------------------------------------
*/

function CreateMapLayers()
{
  var newColor = new CMYKColor();
  newColor.cyan = 25.900661945343;
  newColor.magenta = 100;
  newColor.yellow = 50.0297546386719;
  newColor.black = 11.438162624836;

  var newSpot = activeDoc.spots.add();
  newSpot.name = "PANTONE 220 C";
  newSpot.colorType = ColorModel.SPOT;
  newSpot.color = newColor;

  var newSpotColor = new SpotColor();
  newSpotColor.spot = newSpot;
  newSpotColor.tint = 100;

  // Background
  var backgroundLayer;
  if (activeDoc.layers.length == 1 && activeDoc.layers[0].pageItems.length == 0) backgroundLayer = activeDoc.layers[0];
  else backgroundLayer = activeDoc.layers.add();
  backgroundLayer.name = "Background";
  backgroundLayer.color.red = 0;
  backgroundLayer.color.green = 0;
  backgroundLayer.color.blue = 0;

  // Non-EU28
  var nonEU28 = activeDoc.layers.add();
  nonEU28.name = "Non-EU28";
  nonEU28.color.red = 127;
  nonEU28.color.green = 127;
  nonEU28.color.blue = 127;

  // NUTS
  for (var i = atlasData.NUTSStructure.NUTS.length - 1; i >= 0; i--)
  {
    // Country
    var countryLayer = activeDoc.layers.add();
    countryLayer.name = atlasData.NUTSStructure.NUTS[i].country;
    countryLayer.color = HUBRIS.Color.GetRGBColorFromObject(atlasData.NUTSLayersColors.NUTS[i]);

    // Region
    for (var ii = atlasData.NUTSStructure.NUTS[i].region.length - 1; ii >= 0 ; ii--)
    {
      var regionLayer = countryLayer.layers.add();
      regionLayer.name = atlasData.NUTSStructure.NUTS[i].region[ii];
      regionLayer.color = HUBRIS.Color.GetRGBColorFromObject(atlasData.NUTSLayersColors.NUTS[i]);

      // regionPath = regionLayer.pathItems.polygon((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, 10 + Math.random() * 80, 3 + Math.random() * 10, false);
      with(regionPath)
      {
        fillColor = newSpotColor;
        strokeColor = new NoColor();
      }
    }

    // Country Outline
    var outlineLayer = countryLayer.layers.add();
    outlineLayer.name = GetCountryCode(atlasData.NUTSStructure.NUTS[i].region[0]) + "-OUTLINE";
    outlineLayer.color.red = 0;
    outlineLayer.color.green = 255;
    outlineLayer.color.blue = 0;
  }

  HUBRIS.Logger.ToConsole("\nMap Layers Created");
}

function VerifyMapLayers()
{
  HUBRIS.Logger.ToConsole("\nVerify Map Layers START\n");

  // Compare Doc to List
  var firstLevel = activeDoc.layers;
  for (var i = 0; i < firstLevel.length; i++)
  {
    // FIRST LEVEL
    var foundFirstLevelLayer = false;

    // If Country
    var regionIndex = CompareToCountries(firstLevel[i].name);
    if (regionIndex != -1)
    {
      foundFirstLevelLayer = true;
      if (firstLevel[i].pathItems.length != 0) HUBRIS.Logger.ToConsole(firstLevel[i].name + " has " + firstLevel[i].pathItems.length + " paths", "Warning");
    }

    // Or Others
    if (firstLevel[i].name == "Non-EU28") foundFirstLevelLayer = true;
    else if (firstLevel[i].name == "Background") foundFirstLevelLayer = true;
    else if (firstLevel[i].name == "Capitals") foundFirstLevelLayer = true;
    else if (firstLevel[i].name == "Africa") foundFirstLevelLayer = true;
    else if (firstLevel[i].name == "Non-EU28_") foundFirstLevelLayer = true;
    // TODO
    //else if (firstLevel[i].name == "Nomes") foundFirstLevelLayer = true;
    //else if (firstLevel[i].name == "Paises") foundFirstLevelLayer = true;

    if (!foundFirstLevelLayer)
    {
      HUBRIS.Logger.ToConsole("Unknown country layer: " + firstLevel[i].name, "Warning");
      continue;
    }

    // SECOND LEVEL
    var secondLevel = firstLevel[i].layers;
    for (var ii = 0; ii < secondLevel.length; ii++)
    {
      var foundSecondLevelLayer = CompareToRegions(secondLevel[ii].name, regionIndex);
      if (!foundSecondLevelLayer) HUBRIS.Logger.ToConsole("Unknown region layer: " + secondLevel[ii].name, "Warning");

      if (secondLevel[ii].pathItems.length == 0 && secondLevel[ii].compoundPathItems.length == 0) HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has 0 paths", "Error");      if (secondLevel[ii].pathItems.length == 0 && secondLevel[ii].compoundPathItems.length == 0) HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has 0 paths", "Error");      //if (secondLevel[ii].pathItems.length == 1) HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has 1 path");
      //if (secondLevel[ii].compoundPathItems.length == 1) HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has 1 compound path");
      if (secondLevel[ii].pathItems.length > 1 || secondLevel[ii].compoundPathItems.length > 1)
          HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has " + secondLevel[ii].pathItems.length + " paths and has " + secondLevel[ii].compoundPathItems.length + " compound paths", "Error");
      if (secondLevel[ii].groupItems.length) HUBRIS.Logger.ToConsole(secondLevel[ii].name + " has a group of paths", "Error");
    }
  }

  HUBRIS.Logger.ToConsole("\nVerify Map Layers END\n");
}

function DoDataTitle(selected)
{
  // GET TEXT
    var textsFrames = app.activeDocument.textFrames;
    var dataTitleText = [];

    for (var i = 0; i < textsFrames.length; i++)
    {
      if (textsFrames[i].parent.name == "DataTitle") dataTitleText.push(textsFrames[i]);
    }

    var dataName = new String(selected);
    dataName = dataName.substring(0, 12);
    dataTitleText[0].contents = atlasData.NUTSDataTitles[dataName];
}

function DoMapCaption(mapData, chapter)
{
  // GET TEXT
  var textsFrames = app.activeDocument.textFrames;
  var dataTitleText = [];

  for (var i = 0; i < textsFrames.length; i++)
  {
    if (textsFrames[i].parent.name == "MapCaption") dataTitleText.push(textsFrames[i]);
  }

  dataTitleText[0].contents = mapData.table[0].Caption_Title;

  if (chapter == "Chapter3")
  {
    dataTitleText[1].contents = mapData.table[0].Min;

    for (var i = 2; i < dataTitleText.length; i++)
    {
      dataTitleText[i].contents = mapData.table[i - 2].Classes.toFixed(1);
    }
  }
}

function ColorizeMap(chapterNumber, firstLevel, mapData, regionToClass, mapSwatchColors, magentaClass, yellowClass, cyanClass)
{
  try{
  for (var n = 0; n < mapData.table.length; n++)
  {
    var secondLevel = mapLayers[n];
    var currentClass = regionToClass[n];

    // if (secondLevel.name === mapData.table[n].NUTS)
    // {

      // PATHITEM
      if (secondLevel.pathItems.length != 0) 
      {
        var currentPathItem = secondLevel.pathItems[0];

        // MONO
        if (chapterNumber == "Chapter3" || chapterNumber == "Chapter1")
        {
          currentPathItem.fillColor = mapSwatchColors[2];
          currentPathItem.fillColor.tint = atlasData.NUTSClassesColors.Mono[currentClass];
        }
        // TRIAD
        else
        {
          if (currentClass == magentaClass) currentPathItem.fillColor = mapSwatchColors[0];
          else if (currentClass == yellowClass) currentPathItem.fillColor = mapSwatchColors[1];
          else if (currentClass == cyanClass) currentPathItem.fillColor = mapSwatchColors[2];
          else
          {
            if (currentClass < yellowClass)
            {
              var newPathItem = currentPathItem.duplicate(currentPathItem.parent, ElementPlacement.PLACEATEND);
              ApplyTint(currentPathItem, newPathItem, mapSwatchColors[0], mapSwatchColors[1], atlasData.NUTSClassesColors.Triad.Start[currentClass], atlasData.NUTSClassesColors.Triad.Stop[currentClass]);
            }
            else if (currentClass < cyanClass)
            {
              var newPathItem = currentPathItem.duplicate(currentPathItem.parent, ElementPlacement.PLACEATEND);
              ApplyTint(currentPathItem, newPathItem, mapSwatchColors[1], mapSwatchColors[2], atlasData.NUTSClassesColors.Triad.Start[currentClass], atlasData.NUTSClassesColors.Triad.Stop[currentClass]);
            }
          }
        }
      }

      // COMPOUND PATHITEM
      else if (secondLevel.compoundPathItems.length != 0)
      {
        var currentCompoundPathItem = secondLevel.compoundPathItems[0];
        var compoundsToTint = false;

        for (var k = 0; k < currentCompoundPathItem.pathItems.length; k++)
        {
          var currentPathItem = currentCompoundPathItem.pathItems[k];

          if (chapterNumber == "Chapter3" || chapterNumber == "Chapter1")
          {
            currentPathItem.fillColor = mapSwatchColors[2];
            currentPathItem.fillColor.tint = atlasData.NUTSClassesColors.Mono[currentClass];
          }

          else
          {
            if (currentClass == magentaClass) currentPathItem.fillColor = mapSwatchColors[0];
            else if (currentClass == yellowClass) currentPathItem.fillColor = mapSwatchColors[1];
            else if (currentClass == cyanClass) currentPathItem.fillColor = mapSwatchColors[2];
            else
            {
              if (currentClass < yellowClass) compoundsToTint = true;
              else if (currentClass < cyanClass) compoundsToTint = true;
            }
          }
        }

        if (compoundsToTint)
        {
          var newCompoundPathItem = currentCompoundPathItem.duplicate(currentCompoundPathItem.parent, ElementPlacement.PLACEATEND);
          for (var kk = 0; kk < newCompoundPathItem.pathItems.length; kk++)
          {

            if (chapterNumber == "Chapter3" || chapterNumber == "Chapter1")
            {
              currentCompoundPathItem.pathItems[kk].fillColor = mapSwatchColors[2];
              currentCompoundPathItem.pathItems[kk].fillColor.tint = atlasData.NUTSClassesColors.Mono[n];
            }

            else
            {
              if (currentClass > magentaClass && currentClass < yellowClass) ApplyTint(currentCompoundPathItem.pathItems[kk], newCompoundPathItem.pathItems[kk], mapSwatchColors[0], mapSwatchColors[1], atlasData.NUTSClassesColors.Triad.Start[currentClass], atlasData.NUTSClassesColors.Triad.Stop[currentClass]);
              else if (currentClass > yellowClass && currentClass < cyanClass) ApplyTint(currentCompoundPathItem.pathItems[kk], newCompoundPathItem.pathItems[kk], mapSwatchColors[1], mapSwatchColors[2], atlasData.NUTSClassesColors.Triad.Start[currentClass], atlasData.NUTSClassesColors.Triad.Stop[currentClass]);
            }
          }
        }
      }
      //}


  }
  }
  catch(e)
	{
		alert(e.message);
	}


}

function ApplyTint(currentPathItem, newPathItem, startColor, endColor, startTint, stopTint)
{
  currentPathItem.fillColor = startColor;
  currentPathItem.fillColor.tint = startTint;

  newPathItem.fillColor = endColor;
  newPathItem.fillColor.tint = stopTint;
}
