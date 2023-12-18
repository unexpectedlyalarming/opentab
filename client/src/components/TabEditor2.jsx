import React, { useState } from "react";

export default function TabEditorTwo() {
  class Note {
    constructor() {
      this.type = "empty";
      this.location = [];
      this.value = null;
    }
  }

  const strings = 6;
  const barLength = 32;

  const [tab, setTab] = useState({
    strings: 6,
    tuning: ["E", "B", "G", "D", "A", "E"],
    barLength: 32,
    fretboard: Array.from({ length: strings }, () =>
      Array(barLength).fill(new Note())
    ),
    key: {
      mute: "x",
      slide: "/",
      bend: "b",
      normal: "",
      empty: "-",
      hammer: "h",
      pull: "p",
    },
  });

  const [currentValue, setCurrentValue] = useState(0);

  const [tool, setTool] = useState("pen");

  const [editingNote, setEditingNote] = useState(null);

  function handleToolChange(event) {
    setTool(event.target.value);
  }

  function updateNote(e) {
    const string = parseInt(e.target.id.split("-")[0]);
    const row = parseInt(e.target.id.split("-")[1]);
    // const bar = parseInt(e.target.id.split("-")[2]);

    let type;
    switch (tool) {
      case "pen":
        type = "normal";
        setEditingNote(e.target.id);
        break;
      case "eraser":
        type = "empty";
        break;
      case "slide":
        type = "slide";
        break;
      case "hammer":
        type = "hammer";
        break;
      case "pull":
        type = "pull";
        break;
      case "bend":
        type = "bend";
        break;
      case "mute":
        type = "mute";
        break;
      default:
        type = "normal";
        break;
    }

    const newTab = { ...tab };
    const note = { ...newTab.fretboard[string][row] };
    note.type = type;
    note.location = [string, row];
    note.value = currentValue;
    newTab.fretboard[string][row] = note;
    setTab(newTab);
  }

  function handleInputBlur(e) {
    const string = parseInt(editingNote.split("-")[0]);
    const row = parseInt(editingNote.split("-")[1]);
    let newTab = { ...tab };
    newTab.fretboard[string][row].value = e.target.value;
    setTab(newTab);
    setEditingNote(null);
  }

  //   const tabList = tab.map((tab, index) => {
  //     let tabDisplay = [];

  //     for (let string = 0; string < tab.strings; string++) {
  //       tabDisplay.push(<div className="tab-col">{tab.tuning[string]}</div>);

  //       for (let fret = 0; fret < tab.barLength; fret++) {
  //         const note = tab.fretboard[string][fret];
  //         tabDisplay.push(
  //           <div
  //             className={`tab-row row-${string}`}
  //             onClick={updateNote}
  //             id={string + "-" + fret + "-" + index}
  //             style={{ gridColumn: `${fret + 2}`, gridRow: `${string + 1}` }}
  //           >
  //             {note.type === "normal" ? note.fretValue : tab.key[note.type]}
  //           </div>
  //         );
  //       }
  //     }

  //     return tabDisplay;
  //   });

  function tabList() {
    let tabDisplay = [];
    let totalBars = Math.ceil(tab.fretboard[0].length / barLength);

    for (let bar = 0; bar < totalBars; bar++) {
      let barDisplay = [];

      for (let string = 0; string < tab.strings; string++) {
        if (bar === 0) {
          barDisplay.push(<div className="tab-col">{tab.tuning[string]}</div>);
        }
        for (let fret = bar * barLength; fret < (bar + 1) * barLength; fret++) {
          if (fret < tab.fretboard[string].length) {
            const note = tab.fretboard[string][fret];
            barDisplay.push(
              <div
                className={`tab-row row-${string}`}
                onClick={updateNote}
                id={string + "-" + fret}
                style={{
                  gridColumn: `${(fret % barLength) + 2}`,
                  gridRow: `${string + 1}`,
                }}
              >
                {note.type === "normal" ? note.value : tab.key[note.type]}

                {note.type === "normal" &&
                editingNote === string + "-" + fret ? (
                  <input
                    autoFocus
                    onBlur={handleInputBlur}
                    defaultValue={note.value}
                    style={{
                      gridColumn: `${(fret % barLength) + 2}`,
                      gridRow: `${string + 1}`,
                    }}
                  />
                ) : null}
              </div>
            );
          }
        }
      }

      tabDisplay.push(<div className="tab-grid">{barDisplay}</div>);
    }

    return tabDisplay;
  }

  function addBar() {
    const newTab = { ...tab };

    for (let string = 0; string < newTab.strings; string++) {
      for (let i = 0; i < barLength; i++) {
        newTab.fretboard[string].push(new Note());
      }
    }

    setTab(newTab);
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
        <button onClick={addBar}>Add Bar</button>
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
      <div className="bar-container">{tabList()}</div>
    </div>
  );
}
