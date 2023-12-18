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
      this.barLength = 32;
      this.fretboard = Array.from({ length: this.strings }, () =>
        Array(this.barLength).fill(new Note())
      );
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

  // const [tabs, setTabs] = useState([new Tab()]);

  const [tool, setTool] = useState("pen");

  const [fret, setFret] = useState(0);

  const [string, setString] = useState(0);

  const [capo, setCapo] = useState(0);

  const [duration, setDuration] = useState(0);

  const [strings, setStrings] = useState(6);
  const [barLength, setBarLength] = useState(32);
  const [currentValue, setCurrentValue] = useState(0);

  const [tabs, setTabs] = useState([
    {
      strings: 6,
      barLength: 32,
      fretboard: Array.from({ length: strings }, () =>
        Array(barLength).fill(new Note())
      ),
      tuning: ["E", "B", "G", "D", "A", "E"],
    },
  ]);
  const [tuning, setTuning] = useState(tabs[0].tuning);

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

  // const [fretboard, setFretboard] = useState(
  //   Array.from({ length: tabs[0].strings }, () =>
  //     Array(tabs[0].barLength).fill(new Note())
  //   )
  // );

  // function handleNoteChange(e) {
  //   const location = e.target.id.split("-");
  //   const clickedString = parseInt(location[0]);
  //   const clickedFret = parseInt(location[1]);
  //   const tabIndex = parseInt(location[2]);

  //   const updatedTabs = [...tabs];
  //   const tab = updatedTabs[tabIndex];
  //   const noteAtIndex = { ...fretboard[clickedString][clickedFret] };

  //   let type;
  //   switch (tool) {
  //     case "pen":
  //       type = "normal";
  //       break;
  //     case "eraser":
  //       type = "empty";
  //       break;
  //     case "mute":
  //       type = "mute";
  //       break;
  //     case "slide":
  //       type = "slide";
  //       break;
  //     case "bend":
  //       type = "bend";
  //       break;
  //     default:
  //       type = "normal";
  //       break;
  //   }

  //   // Update the specific note
  //   noteAtIndex.string = clickedString;
  //   noteAtIndex.fret = clickedFret;
  //   noteAtIndex.type = type;
  //   noteAtIndex.location = [clickedString, clickedFret];
  //   noteAtIndex.fretValue = currentValue;

  //   // Update the fretboard state with the modified note
  //   fretboard[clickedString][clickedFret][tabIndex] = noteAtIndex;
  //   setTabs(updatedTabs);
  // }

  function handleNoteChange(e) {
    const location = e.target.id.split("-");
    const clickedString = parseInt(location[0]);
    const clickedFret = parseInt(location[1]);
    const tabIndex = parseInt(location[2]);

    const updatedTabs = [...tabs];
    const tab = updatedTabs[tabIndex];
    const noteAtIndex = { ...tab.fretboard[clickedString][clickedFret] };

    // Update the note and the fretboard
    noteAtIndex.fretValue = currentValue;
    tab.fretboard[clickedString][clickedFret] = noteAtIndex;
    setTabs(updatedTabs);
  }

  // function addColumns(e) {
  //   e.preventDefault();
  //   setTabs([...tabs, new Tab()]);

  //   const updatedFretboard = [
  //     ...fretboard,
  //     fretboard[0],
  //     fretboard[1],
  //     fretboard[2],
  //     fretboard[3],
  //     fretboard[4],
  //     fretboard[5],
  //   ];

  //   // Add new rows, offset by string then fill by bar length
  //   for (let string = 0; string < tabs[0].strings; string++) {
  //     updatedFretboard[string].push(
  //       ...Array.from({ length: tabs[0].barLength }, () => new Note())
  //     );
  //   }

  //   setFretboard(updatedFretboard);
  //   console.log(updatedFretboard);
  // }

  function addColumns(e) {
    e.preventDefault();

    const newTab = {
      strings: 6,
      barLength: 16,
      fretboard: Array.from({ length: strings }, () =>
        Array(barLength).fill(new Note())
      ),
    };

    setTabs([...tabs, newTab]);
  }

  // const tabsList = tabs.map((tab, index) => {
  //   let tabDisplay = [];

  //   for (let string = 0; string < tab.strings; string++) {
  //     tabDisplay.push(<div className="tab-col">{tuning[string]}</div>);

  //     for (let fret = 0; fret < tab.barLength; fret++) {
  //       const note = fretboard[string][fret];
  //       tabDisplay.push(
  //         <div
  //           className={`tab-row row-${string}`}
  //           onClick={handleNoteChange}
  //           id={string + "-" + fret + "-" + index}
  //           style={{
  //             gridColumn: `${fret + 2}`,
  //             gridRow: `${string + 1 + strings * index}`,
  //           }}
  //         >
  //           {note.type === "normal" ? note.fretValue : displayKeys[note.type]}
  //           {note.type === null ? "-" : null}
  //         </div>
  //       );
  //     }
  //   }
  //   return tabDisplay;
  // });
  const tabsList = tabs.map((tab, index) => {
    let tabDisplay = [];

    for (let string = 0; string < tab.strings; string++) {
      tabDisplay.push(<div className="tab-col">{tuning[string]}</div>);

      for (let fret = 0; fret < tab.barLength; fret++) {
        const note = tab.fretboard[string][fret];
        tabDisplay.push(
          <div
            className={`tab-row row-${string}`}
            onClick={handleNoteChange}
            id={string + "-" + fret + "-" + index}
            style={{ gridColumn: `${fret + 2}`, gridRow: `${string + 1}` }}
          >
            {note.type === "normal" ? note.fretValue : displayKeys[note.type]}
          </div>
        );
      }
    }

    return tabDisplay;
  });

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
      <div className="tab-grid">{tabsList}</div>
    </div>
  );
}
