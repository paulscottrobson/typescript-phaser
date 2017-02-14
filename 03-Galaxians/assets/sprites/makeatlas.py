
import os,sys
from PIL import Image

class GraphicObject:
	def __init__(self,fname):
		self.fileName = fname
		self.image = Image.open(fname)

	def width(self):
		return self.image.size[0]

	def height(self):
		return self.image.size[1]

	def render(self,atlas,x,y):
		atlas.paste(self.image,(x,y))

	def getName(self):
		return os.path.basename(self.fileName)[:-4]

	def renderJSON(self,f,x,y,isLast):
		tab = "        "
		f.write(tab+'"{0}": {{\n'.format(self.getName()))
		xy = '"x":{0},"y":{1}'.format(x,y)
		wh = '"w":{0},"h":{1}'.format(self.width(),self.height())
		f.write(tab+'    "frame":{{ {0},{1} }},\n'.format(xy,wh))
		f.write(tab+'    "rotated":false,\n')
		f.write(tab+'    "trimmed":false,\n')
		xy = '"x":{0},"y":{1}'.format(0,0)
		f.write(tab+'    "spriteSourceSize":{{ {0},{1} }},\n'.format(xy,wh))
		f.write(tab+'    "sourceSize":{{ {0} }}\n'.format(wh))
		f.write(tab+"}}{0}\n".format("" if isLast else ","))

class GraphicPacker:
	def __init__(self):
		self.imageWidth = 64 															# width of atlas sheet.
		self.imageList = []																# list of images.

	def append(self,graphicObject):
		self.imageList.append({ "object":graphicObject, "area":graphicObject.width()*graphicObject.height() })
		while graphicObject.width() > self.imageWidth:
			self.imageWidth = self.imageWidth * 2

	def pack(self,packStep = 4):

		self.atlasHeight = 0
		iList = sorted(self.imageList,key=lambda k: k['area'],reverse = True)			# list sorted largest first.
		for i in range(0,len(iList)):													# for every element.
			x = 0																		# suggested position.
			y = 0	
			isOk = False 																# set true when done.
			while not isOk:																# keep going until found.
				iList[i]["left"] = x													# save position
				iList[i]["top"] = y
				iList[i]["right"] = x + iList[i]["object"].width() 
				iList[i]["bottom"] = y + iList[i]["object"].height() 
				isOk = self.canPlace(iList[i],iList,0,i-1)								# check if it can go there
				if not isOk:															# it can't.
					x = x + packStep															# try slightly to right.
					if x + iList[i]["object"].width() >= self.imageWidth: 				# if it can't fit on this line
						x = 0															# move down.
						y = y + packStep

			self.atlasHeight = max(self.atlasHeight,iList[i]["bottom"]+2)				# update the bottom size

	def render(self,baseName):
		baseName = baseName.lower()														# all file names l/c
		atlas = Image.new("RGBA",(self.imageWidth,self.atlasHeight),"black")			# blue background
		for image in self.imageList:													# render all images
			image["object"].render(atlas,image["left"],image["top"])	
		atlas.save(baseName+".png",optimize=True)										# save atlas image	

		subText = open(baseName+".json","w")											# create text
		subText.write("{\n")
		subText.write('    "frames":{\n')

		for image in self.imageList:
			image["object"].renderJSON(subText,image["left"],image["top"],image == self.imageList[-1])
		subText.write("    },\n")
		subText.write('    "meta":{\n');
		subText.write('        "app":"Paul Robson\'s Python texture packer",\n');
		subText.write('        "version":"1.0",\n');
		subText.write('        "image":"{0}",\n'.format(baseName+".png"));
		subText.write('        "size":{\n');  
		subText.write('             "w":{0},\n'.format(self.imageWidth));
		subText.write('             "h":{0}\n'.format(self.atlasHeight));
		subText.write('         },\n');
		subText.write('         "scale":1\n    }\n}\n');
		subText.close()

	def canPlace(self,item,iList,first,last):
		for i in range(first,last+1):													# work through all.
			if self.collides(iList[i],item):											# if collision found return False
				return False
		return True 																	# No collisions return true

	def collides(self,r1,r2):															# Check two items collide.
		separate = 	r1["right"] < r2["left"] or \
					r1["left"] > r2["right"] or \
					r1["top"] > r2["bottom"] or \
					r1["bottom"] < r2["top"]
		return not separate


count = 0
gpack = GraphicPacker()
for root,dirs,files in os.walk("source"):
	for f in files:
		count = count + 1
		fName = root + os.sep + f
		gob = GraphicObject(fName)
		gpack.append(gob)
gpack.pack()
gpack.render("sprites")
print("Grabbed {0} sprites".format(count))