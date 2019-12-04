

from argparse import ArgumentParser
import io
import json
import math
from svgpathtools import *

#returns the contexts of the svg file at f
def getSVGContents(f):
    inputfile = open(f, 'r') # Create a file object in read-only mode.
    content = inputfile.read()
    inputfile.close() # Close the file.
    return content

#writes the contents to a file at f as a JSON. Creates if necessary
def writeJSONContents(f, contents):
    with io.open(f, 'w+', encoding='utf8') as outfile:
        str_ = json.dumps(contents,
                          indent=4, sort_keys=True,
                          separators=(',', ': '), ensure_ascii=False)
        outfile.write(str_)
        outfile.close()

def getBeforePeriod(f):
    return f[:f.find('.')]

def getAfterFwdSlash(f):
    return f[f.rfind('/')+1:]

def stripFileName(f, useLowerCase):
    name = getAfterFwdSlash(getBeforePeriod(f))
    return name.lower() if useLowerCase else name

def getFirstInsideQuotes(f):
    m = f.find('"') + 1
    return f[m:f.find('"',m+1)]


#Gets the string between the final quotes after the first instance of tag in content
#Searches backwards from the first '>' after the tag
#EX:    if content = <helloWorld style="never" points="4 5 6 7">
#       and tag = 'helloWorld'
#Then this function would return "4 5 6 7"
def getQuoteContents(content, tag):
    tagI = content.find(tag)
    endCarrotI = content.find(">", tagI)
    secondQuoteI = content.rfind('"', tagI, endCarrotI)
    firstQuoteI = content.rfind('"', tagI, secondQuoteI - 1)
        #get all pieces of text between the quotes after the tag
    return content[firstQuoteI+1:secondQuoteI]


#Get the width and height tuple of the svg from the svg contents
def getWidthHeight(content):
    quoteContents = getQuoteContents(content, "viewBox")
    viewBoxContents = quoteContents.split()
    width = viewBoxContents[2]
    height = viewBoxContents[3]
    return (float(width), float(height))

def getPoints(content):
    quoteContents = getQuoteContents(content, "polygon")
    pointContents = quoteContents.split()
    return pointContents[:-2] #exclude the last point - svg creates a duplicate of first point

#returns pointList with all points changed to float and normalized to 0...1 within height or width (whichever applies)
def normalizePoints(pointList, widthHeight, digitsToRound):
    #formatString = '%'+str(digitsToRound+2)+'.'+str(digitsToRound)+'f'
    points = []
    for i in range(len(pointList)):
        normalized = 0
        if (i%2==0):
            #first element, and all x coords
            normalized = float(pointList[i]) / float(widthHeight[0])
        else:
            #second element, and all y coords
            normalized = float(pointList[i]) / float(widthHeight[1])
        #normString = str(formatString % normalized) #from https://stackoverflow.com/questions/25665523/casting-float-to-string-without-scientific-notation
        normString = round(normalized, digitsToRound)
        points.append(normString)
    return points

def main():
    # print command line arguments
    parser = ArgumentParser()
    # parser.add_argument("-v", "--verbosity", type=bool, default=False,
    #                 help="increase output verbosity")
    # parser.add_argument("-d", "--decimals", type=int, default=5,
    #                 help="defines the number of output decimals")
    parser.add_argument("-i", "--input", default="SVG/",
                    help="input path to find all SVGs within")
    parser.add_argument("-o", "--output", default="output.json",
                    help="write report to FILE")
    # parser.add_argument("-l", "--lowerCase", default=True,
    #                 help="only write lower case into the json")
    args = parser.parse_args()


    svgContents = getSVGContents(args.input+".svg")


    #Find the start character of the first tag that is relevant to us
    pathliststart = 1000000
    firstpathtag = svgContents.find("<path id=")
    firstpolygontag = svgContents.find("<polygon id=")
    firstcircletag = svgContents.find("<circle id=")
    if (firstpathtag >= 0):
        pathliststart = min(pathliststart, firstpathtag)
    if (firstpolygontag >= 0):
        pathliststart = min(pathliststart, firstpolygontag)
    if (firstcircletag >= 0):
        pathliststart = min(pathliststart, firstcircletag)


    svgContentList = svgContents[pathliststart:].split('id=')
        #remove trash before the first id
    svgContentList.remove(svgContentList[0])

    widthheight = getWidthHeight(svgContents)

    paths, attributes = svg2paths(args.input+".svg")


    agg = ""
    agg += 'array: [\n'

    print("\n"*20)
    for i in range(len(paths)):
        path = paths[i]
        print(path)
        print('\n\n')

        rawtext = svgContentList[i]

        # path = None 
        # xmin = xmax = ymin = ymax = 0

        # if (rawtext.find(' d="') >= 0):
        #     print("path")
        #     #this is a path
        #     dattribute = getFirstInsideQuotes(rawtext[rawtext.find(' d"')])
        #     print("DDDDD: "+dattribute)
        #     path = parse_path(dattribute)
        #     print(path)
        #     xmin, xmax, ymin, ymax = path.bbox()

        # elif (rawtext.find(' points="') >= 0):
        #     #this is a polygon
        #     #path = parse_path(rawtext.getQuoteContents("d"))
        #     print("polygon")
        # elif (rawtext.find(' r="') >= 0):
        #     #this is a circle
        #     #path = parse_path(rawtext.getQuoteContents("d"))
        #     print("circle")

        # print (xmin, xmax, ymin, ymax)

        name = getFirstInsideQuotes(rawtext)
        print(name)

        namedash = name.find('-')
        if (namedash >= 0):
            name = name[:namedash]

        xmin, xmax, ymin, ymax = path.bbox()
        xmin = (xmin / widthheight[0])
        xmax = (xmax / widthheight[0])
        temp = ymin
        ymin = 1 - (ymax / widthheight[1])
        ymax = 1 - (temp / widthheight[1])

        print("y: "+str(ymin)+" "+str(ymax))
        print("x: "+str(xmin)+" "+str(xmax))
        size = [  
            (xmax - xmin),
            (ymax - ymin)
        ]
        print(size)
        print("\n")
        center = [  
            (xmax + xmin) / 2.0,
            (ymax + ymin) / 2.0
        ]

        agg += (
            '\n\t{'+
            '\n\t\tsrc: "'+name+'.svg",'+
            '\n\t\tx: '+str(center[0])+','+
            '\n\t\ty: '+str(1-center[1])+','+
            '\n\t\tz: '+str(4.0)+','+
            '\n\t\theight: '+str(size[1])+''+
            '\n\t}'
        )

        #add comma if this is not the last entry
        if (i < len(paths) - 1):
            agg += ','

        # print(path)
        # print(name)
        # print("\n")

    agg += '\n]'

    print(agg)

    # writeJSONContents(args.output, aggregateOutput)

if __name__ == "__main__":
    main()
