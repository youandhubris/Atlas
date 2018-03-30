/*
---------------------------------------------
GRAPHS
---------------------------------------------
*/

function DoGraph1(selectedFile, firstLevel)
{
  // GET JSON FILE
  var graph1Data;
  var graph1DataID = GetDataName(graph1Object, selectedFile);
  if (graph1DataID != "") graph1Data = HUBRIS.Data.LoadData(atlasSettings.dataFolder, graph1DataID + "-Data");
  else HUBRIS.Logger.ToConsole("Missing graph1 for: " + selectedFile, "Error");

  if (graph1Data.Table.length == 20)
  {
    // GET TEXT
    var textsFrames = app.activeDocument.textFrames;
    var chap2graph1Text = [];

    for (var i = 0; i < textsFrames.length; i++)
    {
      if (textsFrames[i].parent.name == "Chapter2-Graph1" && chap2graph1Text.length < 20) chap2graph1Text.push(textsFrames[i]);
    }

    // GET RECTANGLES
    var chap2graph1Rect = [];
    for (var i = 0; i < firstLevel.length; i++)
    {
      if (firstLevel[i].name == "Chapter2-Graph1") chap2graph1Rect = firstLevel[i].pathItems;
    }

    // APPLY WIDTH
    for (var i = chap2graph1Text.length - 1; i >= 0; i--)
    {
      var value = graph1Data.Table[i].Number_Values;
      var margin = HUBRIS.Math.MMToPoint(2);
      var widthMM = HUBRIS.Math.MapValue(value, 0, 100, 0, 25, true);
      var width = HUBRIS.Math.MMToPoint(widthMM);

      chap2graph1Text[i].contents = value;

      chap2graph1Rect[i].width = width;

      if (value == 0) chap2graph1Rect[i].remove();
      else chap2graph1Text[i].translate(width + margin, 0);
    }
  }

  else HUBRIS.Logger.ToConsole("Wrong length for: " + graph1DataID, "Error");
}

function DoGraph2(selectedFile, firstLevel, mapSwatchColors, magentaClass, yellowClass, cyanClass)
{
  // GET JSON FILE
  var graph2Data;
  var graph2DataID = GetDataName(graph2Object, selectedFile);
  if (graph2DataID != "") graph2Data = HUBRIS.Data.LoadData(atlasSettings.dataFolder, graph2DataID + "-Data");
  else HUBRIS.Logger.ToConsole("Missing graph2 for: " + selectedFile, "Error");


  // RESCALE DATA (20 -> 10 Array)
  var scaledNumberValues = [];

  for (var i = 0; i < graph2Data.Table.length; i+=2)
  {
    var newValue = graph2Data.Table[i].Number_Values + graph2Data.Table[i + 1].Number_Values;
    scaledNumberValues.push(newValue);
  }


  // GET RECTANGLES
  var chap2graph2Rect = [];
  for (var i = 0; i < firstLevel.length; i++)
  {
    if (firstLevel[i].name == "Chapter2-Graph2") chap2graph2Rect = firstLevel[i].pathItems;
  }


  // APPLY WIDTH & TRANSLATION
  var xTranslation = 0;
  var colorClass = [];

  for (var i = 0; i < 10; i++)
  {
    var value = scaledNumberValues[i];
    if (value == 0) continue;
    else
    {
      var widthMM = HUBRIS.Math.MapValue(value, 0, 100, 0, 131, true);
      var width = HUBRIS.Math.MMToPoint(widthMM);

      var newRect = chap2graph2Rect[0].duplicate(chap2graph2Rect[0].parent, ElementPlacement.PLACEATEND);
      newRect.width = width;
      newRect.translate(xTranslation, 0);

      xTranslation += width;
      colorClass.push(i);
    }
  }

  // CLEANUP
  chap2graph2Rect[0].remove();


  // GET RECTANGLES
  chap2graph2Rect = [];
  for (var i = 0; i < firstLevel.length; i++)
  {
    if (firstLevel[i].name == "Chapter2-Graph2") chap2graph2Rect = firstLevel[i].pathItems;
  }


  // APPLY COLORS
  for (var i = chap2graph2Rect.length - 1; i >= 0; i--)
  {
    var currentClass = colorClass[i];
    var currentPathItem = chap2graph2Rect[i];

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

function DoGraph3(selectedFile, graphObject, firstLevel, targetLayer)
{
    // var graph3Order = ["AL", "BE", "BG", "CY", "CRO", "CZ", "DN", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LAT", "LTU", "LU", "MT", "NED", "PL", "PT", "RO", "SVK", "SVN", "ESP", "SE", "UK"];
    //var graph3Order = ["AT", "BE", "BG", "CY", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "EL", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "UK"];
    //var graph3Countries = ["Czechia-CZ","Luxembourg-LU","Romania-RO","Sweden-SE","Finland-FI","Denmark-DK","Malta-MT","Slovakia-SK","Netherlands-NL","Poland-PL","Hungary-HU","United Kingdom-UK","Estonia-EE","Slovenia-SI","Austria-AT","France-FR","Bulgaria-BG","Germany-DE","Latvia-LV","Lithuania-LT","Ireland-IE","Italy-IT","Cyprus-CY","Portugal-PT","Croatia-HR","Spain-ES","Belgium-BE","Greece-EL"];
    
    // GET JSON FILE
    var graph3Data;
    var graph3DataID = GetDataName(graphObject, selectedFile);
    if (graph3DataID != "") graph3Data = HUBRIS.Data.LoadData(atlasSettings.dataFolder, graph3DataID + "-Data");
    else HUBRIS.Logger.ToConsole("Missing graph3 for: " + selectedFile, "Error");

    // HUBRIS.Logger.ToConsole("Length: " + graph3Data.Table.length);
    // HUBRIS.Logger.ToConsole("Min: " + graphMin + " / " + Math.floor(graphMin));
    // HUBRIS.Logger.ToConsole("Max: " + graphMax + " / " + Math.ceil(graphMax));

    // GET FACTOR & STEPS
    var stepFactor = Math.ceil(graph3Data.Table[0].Max * 0.25);
    var graphMin = 0;
    var graphMax = stepFactor * 4;

    if (selectedFile.indexOf("Chapter3-019") != -1)
    {
        graphMin = 0.0;
        stepFactor = 0.6;
        graphMax = 2.4;
    }

    else if (selectedFile.indexOf("Chapter3-034") != -1)
    {
        graphMin = 70;
        stepFactor = 5;
        graphMax = 90;
    }

    else if (selectedFile.indexOf("Chapter3-038") != -1)
    {
        graphMin = 15000;
        stepFactor = 5000;
        graphMax = 35000;
    }

    else if (selectedFile.indexOf("Chapter3-044") != -1)
    {
        graphMin = 30;
        stepFactor = 9;
        graphMax = 66;
    }

    else if (selectedFile.indexOf("Chapter3-046") != -1)
    {
        graphMin = 1.0;
        stepFactor = 0.05;
        graphMax = 1.2;
    }

    else if (selectedFile.indexOf("Chapter3-047") != -1)
    {
        graphMin = 12;
        stepFactor = 3;
        graphMax = 24;
    }

    var graph3Steps = [];

    graph3Steps.push(graphMin);
    graph3Steps.push(graphMin + stepFactor);
    graph3Steps.push(graphMin + stepFactor * 2);
    graph3Steps.push(graphMin + stepFactor * 3);
    graph3Steps.push(graphMax);


    // GET TEXT
    var textsFrames = app.activeDocument.textFrames;
    var chap2graph3Text = [];
    var countryListText = "";

    for (var i = 0; i < textsFrames.length; i++)
    {
      if (textsFrames[i].parent.name == targetLayer && chap2graph3Text.length < 20) chap2graph3Text.push(textsFrames[i]);
    }

    // GET ELLIPSES
    var chap2graph3Items = [];
    for (var i = 0; i < firstLevel.length; i++)
    {
      if (firstLevel[i].name == targetLayer) chap2graph3Items = firstLevel[i].pathItems;
    }

    for (var i = 0; i < graph3Data.Table.length; i++)
    {

      var str = graph3Data.Table[i].Country;
      var currentCountry = str.substring(str.indexOf('-') + 1, str.length);
      currentCountry += "\n";
      countryListText += currentCountry;


      var xMM = 4.2 * i;
      var x = HUBRIS.Math.MMToPoint(xMM);
      var yMM = 0;

      if (currentCountry.indexOf('*') == -1)
      {
        if (targetLayer == "Chapter3-Graph2")
        { 
          // National Average
          yMM = HUBRIS.Math.MapValue(graph3Data.Table[i].National_Average, graphMin, graphMax, 0, 41.8, true);
          y = HUBRIS.Math.MMToPoint(yMM);
          var newNationalAverage = chap2graph3Items[0].duplicate(chap2graph3Items[0].parent, ElementPlacement.PLACEATEND);
          newNationalAverage.translate(x, y);
        }


        // NUTS Regions
        var firstNUTSvalue = "";
        var atLeastOneIsNotEqual = false;
        var countNUTSvalues = 0;

        for (var n = 1; n <= 39; n++)
        {
          var nString = n.toString();
          var newNUTSvalue = graph3Data.Table[i][nString];

          if (newNUTSvalue != "") 
          {
            yMM = HUBRIS.Math.MapValue(newNUTSvalue, graphMin, graphMax, 0, 41.8, true);
            y = HUBRIS.Math.MMToPoint(yMM);

            // var newNUTS = chap2graph3Items[2].duplicate(chap2graph3Items[2].parent, ElementPlacement.PLACEATEND);
            // newNUTS.translate(x, y);

            if (firstNUTSvalue == "") firstNUTSvalue = newNUTSvalue;
            
            if (firstNUTSvalue != newNUTSvalue) atLeastOneIsNotEqual = true;
            countNUTSvalues++;
          }
        }
      }



      // Capital_Region
      yMM = HUBRIS.Math.MapValue(graph3Data.Table[i].Capital_Region, graphMin, graphMax, 0, 41.8, true);
      y = HUBRIS.Math.MMToPoint(yMM);

      if (targetLayer == "Chapter3-Graph2" || countNUTSvalues < 2)
      {
        var newCapitalRegion = chap2graph3Items[1].duplicate(chap2graph3Items[1].parent, ElementPlacement.PLACEATEND);
        newCapitalRegion.translate(x, y);
      }

      else if (atLeastOneIsNotEqual == true)
      {
        var newCapitalRegion = chap2graph3Items[1].duplicate(chap2graph3Items[1].parent, ElementPlacement.PLACEATEND);
        newCapitalRegion.translate(x, y);
      }




      for (var n = 1; n <= 39; n++)
      {
        var nString = n.toString();
        var newNUTSvalue = graph3Data.Table[i][nString];

        if (newNUTSvalue != "") 
        {
          yMM = HUBRIS.Math.MapValue(newNUTSvalue, graphMin, graphMax, 0, 41.8, true);
          y = HUBRIS.Math.MMToPoint(yMM);

          var newNUTS = chap2graph3Items[2].duplicate(chap2graph3Items[2].parent, ElementPlacement.PLACEATEND);
          newNUTS.translate(x, y);
        }
      }






    }
    


    // EU28 AVERAGE
    if (targetLayer == "Chapter3-Graph2")
    {
      var yMM = HUBRIS.Math.MapValue(graph3Data.Table[0].EU28_Average, graphMin, graphMax, 0, 41.8, true);
      var y = HUBRIS.Math.MMToPoint(yMM);

      chap2graph3Items[3].translate(0, y);
      chap2graph3Items[3].move(chap2graph3Items[3].parent, ElementPlacement.PLACEATEND);


      chap2graph3Text[1].contents = graph3Data.Table[0].Caption_Title_Y;

      chap2graph3Text[2].contents = graph3Steps[0];
      chap2graph3Text[3].contents = graph3Steps[1];
      chap2graph3Text[4].contents = graph3Steps[2];
      chap2graph3Text[5].contents = graph3Steps[3];
      chap2graph3Text[6].contents = graph3Steps[4];
    }

    // Caption X
    chap2graph3Text[0].contents = countryListText;

    // CLEANUP
    chap2graph3Items[2].remove();
    chap2graph3Items[1].remove();
    chap2graph3Items[0].remove();

    var chapter2graph3Layer = firstLevel.getByName(targetLayer);
    var lockLayer = chapter2graph3Layer.layers[0];
    lockLayer.zOrder(ZOrderMethod.SENDTOBACK);
    
}

function DoGraph4(selectedFile, mapData, graphObject, firstLevel, mapSwatchColors)
{
  var dataSet = ["-01A", "-01B"];
  var graphDates = [];

  // SETUP
  var baseLine;
  var baseFrame;
  var blackLine;
  var blueLine;

  for (var i = 0; i < firstLevel.length; i++)
  {
    if (firstLevel[i].name == "Chapter3-Graph1")
      {
        baseLine = firstLevel[i].pathItems[0];
        baseFrame = firstLevel[i].pathItems[1];
        blackLine = firstLevel[i].pathItems[2];
        blueLine = firstLevel[i].pathItems[3];
      }
  }

  // GET JSON FILE & MIN / MAX
  var graph4Data = [];

  var xMin = 9999999999;
  var xMax = -9999999999;
  var yMin = 0;
  var yMax = -9999999999;

  for (var i = 0; i < dataSet.length; i++)
  {
    // GET JSON FILE
    var graph4DataID = GetDataName2(graphObject, selectedFile, dataSet[i]);

    // HUBRIS.Logger.ToConsole("graph4DataID: " + graph4DataID);
    // HUBRIS.Logger.ToConsole("Date: " + atlasData.Chapter3Graph1Dates[graph4DataID]);


    if (graph4DataID != "")
      {
        graph4Data.push(HUBRIS.Data.LoadData(atlasSettings.dataFolder, graph4DataID + "-Data"));
        graphDates.push(atlasData.Chapter3Graph1Dates[graph4DataID]);
      }
    else
    {
      HUBRIS.Logger.ToConsole("Missing graph1 for: " + selectedFile, "Warning");
      break;
    }

    if (graph4Data.length == i + 1)
    {
      // GET MIN & MAX
      for (var ii = 0; ii < graph4Data[i].Table.length; ii++)
      {
        xMin = Math.min(graph4Data[i].Table[ii].x, xMin);
        xMax = Math.max(graph4Data[i].Table[ii].x, xMax);
        // yMin = Math.min(graph4Data[i].Table[ii].y, yMin);
        yMax = Math.max(graph4Data[i].Table[ii].y, yMax);
      }
    }
  }


  for (var i = graph4Data.length - 1; i >= 0; i--)
  {
    // GET POINTS
    var points = [];

    points.push([0, 0]);
    points.push([HUBRIS.Math.MMToPoint(57.44), 0]);
    points.push([HUBRIS.Math.MMToPoint(57.44), HUBRIS.Math.MMToPoint(43.134)]);
    points.push([0, HUBRIS.Math.MMToPoint(43.134)]);

    for (var ii = 0; ii < graph4Data[i].Table.length; ii++)
    {
      var xMM = HUBRIS.Math.MapValue(graph4Data[i].Table[ii].x, xMin, xMax, 0, 57.44, true);
      var yMM = HUBRIS.Math.MapValue(graph4Data[i].Table[ii].y, yMin, yMax, 0, 43.134, true);
      var x = HUBRIS.Math.MMToPoint(xMM);
      var y = HUBRIS.Math.MMToPoint(yMM);
      points.push([x, y]);
    }

    // APPLY
    var newLine = baseLine.duplicate(baseLine.parent, ElementPlacement.PLACEATEND);
    
    newLine.setEntirePath(points);
    newLine.position = baseFrame.position;

    newLine.filled = false;
    newLine.stroked = true;
    if (i == 1 || graph4Data.length == 1)
      {
        newLine.strokeColor = mapSwatchColors[2];
      }

    if (graph4Data.length == 1)
      {
        blackLine.strokeColor = mapSwatchColors[2];

      }


    newLine.pathPoints[3].remove();
    newLine.pathPoints[2].remove();
    newLine.pathPoints[1].remove();
    newLine.pathPoints[0].remove();


  }



  // GET TEXT
  var textsFrames = app.activeDocument.textFrames;
  var chap3graph1Text = [];

  for (var i = 0; i < textsFrames.length; i++)
  {
    if (textsFrames[i].parent.name == "Chapter3-Graph1" && chap3graph1Text.length < 20) chap3graph1Text.push(textsFrames[i]);
  }

  // CAPTIONS
  chap3graph1Text[0].contents = graph4Data[0].Table[0].Caption_Title_Y;
  chap3graph1Text[1].contents = graph4Data[0].Table[0].Caption_Title_X;

  // X AXIS
  var xAxisMin = mapData.table[0].Min;
  var xAxisMax = mapData.table[0].Max;
  chap3graph1Text[2].contents = xAxisMin.toFixed(1);
  chap3graph1Text[3].contents = ((xAxisMax - xAxisMin) * 0.5).toFixed(1);
  chap3graph1Text[4].contents = xAxisMax.toFixed(1);

  // Dates
  chap3graph1Text[5].contents = graphDates[0];
  if (graphDates.length > 1) chap3graph1Text[6].contents = graphDates[1];
  else
  {
    chap3graph1Text[6].remove();
    blueLine.remove();
  }



  // CLEANUP
  baseFrame.remove();
  baseLine.remove();

  var baseLines = HUBRIS.Layers.GetLayersByName(activeDocument.layers, ['LockGraph4'], 1, true);
  baseLines[0].zOrder(ZOrderMethod.SENDTOBACK);
}
