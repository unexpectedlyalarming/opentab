import React, { useEffect, useState } from "react";

export default function TabEditor() {
  class Note {
    constructor() {
      this.string = 0;
      this.fret = 0;
      this.duration = 0;
      this.type = "empty";
      this.location = [];
      this.fretValue = 0;
    }
  }

  class Tab {
    constructor() {
      this.tuning = ["E", "B", "G", "D", "A", "E"];
      this.capo = 0;
      this.barLength = 8;
      this.bars = [
        {
          notes: Array(this.barLength).fill(""),
          duration: this.barLength,
          timeSignature: [4, 4],
        },
      ];
      this.strings = 6;
    }
  }

  const displayKeys = {
    mute: "x",
    slide: "/",
    bend: "b",
    normal: "",
    empty: "-",
  };

  const [tab, setTab] = useState(new Tab());

  const [tool, setTool] = useState("pen");

  const [fret, setFret] = useState(0);

  const [string, setString] = useState(0);

  const [note, setNote] = useState(new Note());

  const [notes, setNotes] = useState([]);

  const [tuning, setTuning] = useState(tab.tuning);

  const [capo, setCapo] = useState(0);

  const [duration, setDuration] = useState(0);

  const [barDuration, setBarDuration] = useState(0);

  const [timeSignature, setTimeSignature] = useState([4, 4]);

  const [strings, setStrings] = useState(tab.strings);
  const [currentValue, setCurrentValue] = useState(0);

  function handleToolChange(e) {
    setTool(e.target.value);
  }

  function handleFretChange(e) {
    setFret(e.target.value);
  }

  function handleStringChange(e) {
    setString(e.target.value);
  }

  function handleTuningChange(e) {
    setTuning(e.target.value);
  }

  function handleCapoChange(e) {
    setCapo(e.target.value);
  }

  function handleDurationChange(e) {
    setDuration(e.target.value);
  }

  const [fretboard, setFretboard] = useState(
    Array.from({ length: tab.strings }, () =>
      Array(tab.barLength).fill(new Note())
    )
  );

  function handleNoteChange(e) {
    const location = e.target.id.split("-");
    const clickedString = parseInt(location[0]);
    const clickedFret = parseInt(location[1]);

    const updatedFretboard = [...fretboard];
    const noteAtIndex = { ...updatedFretboard[clickedString][clickedFret] };

    let type;
    switch (tool) {
      case "pen":
        type = "normal";
        break;
      case "eraser":
        type = "empty";
        break;
      case "mute":
        type = "mute";
        break;
      case "slide":
        type = "slide";
        break;
      case "bend":
        type = "bend";
        break;
      default:
        type = "normal";
        break;
    }

    // Update the specific note
    noteAtIndex.string = clickedString;
    noteAtIndex.fret = clickedFret;
    noteAtIndex.type = type;
    noteAtIndex.location = [clickedString, clickedFret];
    noteAtIndex.fretValue = currentValue;

    // Update the fretboard state with the modified note
    updatedFretboard[clickedString][clickedFret] = noteAtIndex;
    setFretboard(updatedFretboard);
  }

  function displayTab() {
    let tabDisplay = [];

    for (let string = 0; string < tab.strings; string++) {
      tabDisplay.push(<div className="tab-col">{tuning[string]}</div>);

      for (let fret = 0; fret < tab.barLength; fret++) {
        const note = fretboard[string][fret];
        tabDisplay.push(
          <div
            className={`tab-row row-${string}`}
            onClick={handleNoteChange}
            id={string + "-" + fret}
            style={{ gridColumn: `${fret + 2}`, gridRow: `${string + 1}` }}
          >
            {note.type === "normal" ? note.fretValue : displayKeys[note.type]}
          </div>
        );
      }
    }
    return tabDisplay;
  }

  function addColumns(e) {
    e.preventDefault();
    //Take the bar length, and add a new column to the fretboard
    const updatedFretboard = [...fretboard];
    const newColumn = Array(tab.strings).fill(new Note());
    updatedFretboard.push(newColumn);
    setFretboard(updatedFretboard);
  }

  return (
    <div className="container">
      <div className="tools">
        <button onClick={handleToolChange} value="pen">
          Pen
        </button>
        <button onClick={handleToolChange} value="eraser">
          Eraser
        </button>
        <button onClick={handleToolChange} value="mute">
          Mute
        </button>
        <button onClick={handleToolChange} value="slide">
          Slide
        </button>
        <button onClick={handleToolChange} value="bend">
          Bend
        </button>
        <button onClick={addColumns}>Add Bar</button>
        <div className="tool-options">
          <label htmlFor="fret">Fret</label>
          <input
            type="number"
            name="fret"
            id="fret"
            value={currentValue}
            onChange={(e) => {
              setCurrentValue(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="tab-grid">{displayTab()}</div>
    </div>
  );
}
