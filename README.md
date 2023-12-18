# What is OpenTab?
Have you ever used a guitar tab site and noticed that it either has an awful UI/editor or it costs an absurd amount of money (or both)? OpenTab's goal is to be a web editor that has keyboard navigation and easy editing, and allows you to download your tabs in markdown to print or use anywhere.

## How do I use OpenTab?

At the moment OpenTab is built in React. Eventually it should be hosted online and accessible to everyone for free. If you want to use it early here are the install instructions.

> Prerequisites:
> Node.JS & NPM

- Clone the repo
- ```cd client```
- ```npm install```
- ```npm run dev```

That's it!


## Usage

OpenTab on its own is pretty intuitive, you click the tool and click on the frets. For readability, you can only click every other fret with a normal pen tool so that bends and hammerons and such will fit nicely.
There are some shortcuts to try out though!

> Ctrl + S: Save

> Ctrl + L: Load

> 1-7: The toolbox in the order it appears

> Ctrl + N: New Tab

> Up/Down Arrow: Using the pen tool, increments the value by one so you don't have to type.

Additionally, OpenTab locally saves your progress whenever you make a change. Whatever the latest tab you're on is, it will save it for the next time you use it. You can also save a JSON save to be reopened in the editor, or a .TXT file that has markdown formatting.
