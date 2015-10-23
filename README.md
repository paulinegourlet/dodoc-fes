DoDoc
==========

##Presentation

DoDoc is a documentation tool for children in classrooms.   
DoDoc is a research project of [l'atelier des chercheurs](http://latelier-des-chercheurs.fr/).  
Dodoc is both a web documentation platform and a physical device.  
![dodoc](http://www.lopendoc.org/lopendocresearch/wp-content/uploads/sites/5/2015/06/schema-dodoc-02.png)
![dodoc](http://latelier-des-chercheurs.fr/img/img-dodoc-fes0.jpg)

##How to install Dodoc

### Clone the repo or download it
```git clone https://github.com/sarahgarcin/dodoc-fes.git```

###Install nodejs on your computer

You can install nodejs from this page [](https://nodejs.org/)   
Once installed, you can verify that it's installed correctly by typing in the terminal   
```node -v```

###Install dependencies

In terminal go to the dodoc directory you have just clones or download:
```cd path/of/the/dodoc/directory```
Once you are in the right directory enter the command:
```npm install```

###Install ffmpeg
Official page [](https://www.ffmpeg.org/)

####On Linux
Install ffmpeg from your package manager.

####On windows (it works on every version of windows)
Follow this tutorial: [](http://adaptivesamples.com/how-to-install-ffmpeg-on-windows/)

####On Mac OSX
Follow this tutorial: [](http://www.renevolution.com/how-to-install-ffmpeg-on-mac-os-x/)

###Add the missing files
- Create a new folder named "sessions" into your dodoc directory.
- Add the 3 certificates files for using https. (If you need these certificates you can send us an email)

###Run DoDoc
Run the server in the terminal
```node server.js```

Go to browser and go to the url (For now dodoc works only on Google Chrome or Chromium)
[](https://localhost:8080)
Your browser is going to tell that the website is unsafe, go on. 


