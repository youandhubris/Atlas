import os  
import re
import sys


# sys.args 
workingDir = sys.argv[1]
scriptVersion = sys.argv[2]


#scripts paths
scripts = [	"Libs/json2.js",

			"Hubris/BridgeTalk.js",
			"Hubris/Header.js",
			"Hubris/Color.js",
			"Hubris/Data.js",
			"Hubris/Documents.js",
			"Hubris/Export.js",
			"Hubris/GUI.js",
			"Hubris/Layers.js",
			"Hubris/Logger.js",
			"Hubris/Math.js",
			"Hubris/Settings.js",
			"Hubris/Hubris.js",

			"Atlas-Dev.js",
			"Atlas/Main.js",
			"Atlas/Settings.js",
			"Atlas/Gui.js",
			"Atlas/NUTS.js",
			"Atlas/Map.js",
			"Atlas/Graphs.js"]


#appending all the scripts inside the appender variable
appender = ''  
for script in scripts:  
    path = workingDir + '/' + script
    fileIn = open(path, 'rU')
    appender = appender + fileIn.read() + '\n'
    fileIn.close()

appender = appender.replace("Atlas 0.0.0", "Atlas " + scriptVersion)
appender = appender.replace("#include","// #include")


#writing the content to file
fileOut = open('/Applications/Adobe Illustrator CC 2018/Presets.localized/en_GB/Scripts' + '/Atlas-Dev.js', 'w')  
fileOut.write(appender)  
fileOut.close() 