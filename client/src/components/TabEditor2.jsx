import { set } from "mongoose";
import React, { useEffect, useState } from "react";

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

  const initTab = {
    strings: strings,
    tuning: ["E", "B", "G", "D", "A", "E", "B", "F#"],
    barLength: barLength,
    fretboard: Array.from({ length: strings }, () =>
      Array(barLength).fill(new Note())
    ),
    name: "Untitled Tab",
    key: {
      mute: "x",
      slide: "/",
      bend: "b",
      normal: "",
      empty: "-",
      hammer: "h",
      pull: "p",
    },
    bpm: 120,
    tabKey: "C Major",
    capo: 0,
  };

  const [tab, setTab] = useState(initTab);

  const [currentValue, setCurrentValue] = useState(0);

  const [tool, setTool] = useState("pen");

  const [editingNote, setEditingNote] = useState(null);

  const [isTuning, setIsTuning] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

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
        if (row % 2 !== 0) {
          return;
        }
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
        if (row % 2 !== 0) {
          return;
        }
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
    let oldValue = newTab.fretboard[string][row].value;
    newTab.fretboard[string][row].value = currentValue;

    if (
      currentValue >= 0 &&
      currentValue <= 9 &&
      oldValue >= 10 &&
      oldValue <= 99
    ) {
      if (row + 1 < newTab.fretboard[string].length) {
        newTab.fretboard[string][row + 1] = { type: "empty" };
      }
    }

    setTab(newTab);
    setEditingNote(null);
    setCurrentValue(0);
  }

  const [isMouseDown, setIsMouseDown] = useState(false);

  function handleMouseDown(e) {
    setIsMouseDown(true);
    updateNote(e);
  }

  function handleMouseUp() {
    setIsMouseDown(false);
  }

  function handleMouseOver(e) {
    if (isMouseDown) {
      updateNote(e);
    }
  }

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
            if (note.type === "normal" && note.value >= 10) {
              const digits = note.value.toString().split("");
              for (let i = 0; i < digits.length; i++) {
                barDisplay.push(
                  <div
                    className={`tab-row row-${string}`}
                    onClick={updateNote}
                    id={string + "-" + (fret + i)}
                    style={{
                      gridColumn: `${(fret % barLength) + 2 + i}`,
                      gridRow: `${string + 1}`,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseOver={handleMouseOver}
                  >
                    {digits[i]}
                  </div>
                );
              }
              fret += digits.length - 1; // Skip the number of frets equal to the number of digits - 1
            } else {
              barDisplay.push(
                <div
                  className={`tab-row row-${string}`}
                  onClick={updateNote}
                  id={string + "-" + fret}
                  style={{
                    gridColumn: `${(fret % barLength) + 2}`,
                    gridRow: `${string + 1}`,
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseOver={handleMouseOver}
                >
                  {note.type === "normal" ? note.value : tab.key[note.type]}

                  {note.type === "normal" &&
                  editingNote === string + "-" + fret ? (
                    <input
                      id="note-input"
                      autoFocus
                      onBlur={handleInputBlur}
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onFocus={(e) => {
                        e.target.select();
                        setCurrentValue(note.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
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

  function deleteLastBar() {
    const newTab = { ...tab };
    newTab.fretboard = newTab.fretboard.map((string) =>
      string.slice(0, -barLength)
    );
    setTab(newTab);
  }

  //Manual saving and loading

  function saveTab() {
    const tabJSON = JSON.stringify(tab);

    const blob = new Blob([tabJSON], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = tab.name + ".json";

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  function loadTab() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = (e) => {
        const tabJSON = e.target.result;
        const tab = JSON.parse(tabJSON);
        setTab(tab);
      };
    };

    input.click();

    input.remove();
  }

  function convertToMarkdown() {
    let markdown = `# ${tab.name}\n\n`;

    markdown += `## Key: ${tab.tabKey}\n\n`;

    markdown += `## BPM: ${tab.bpm}\n\n`;

    markdown += `## Tuning: ${tab.tuning.join("")}\n\n`;

    markdown += `## Capo: ${tab.capo}\n\n`;

    for (let bar = 0; bar < tab.fretboard[0].length; bar += 2 * tab.barLength) {
      for (let i = 0; i < tab.strings; i++) {
        markdown += `${tab.tuning[i]}|`;

        for (
          let j = bar;
          j < Math.min(bar + 2 * tab.barLength, tab.fretboard[0].length);
          j++
        ) {
          const note = tab.fretboard[i][j];
          markdown += note.type === "normal" ? note.value : tab.key[note.type];
          if (
            (j + 1) % tab.barLength === 0 &&
            j < Math.min(bar + 2 * tab.barLength, tab.fretboard[0].length) - 1
          ) {
            markdown += "|";
          }
        }

        markdown += "\n";
      }

      markdown += "\n";
    }

    return markdown;
  }

  function downloadTabAsText() {
    const markdown = convertToMarkdown();

    const blob = new Blob([markdown], { type: "text/plain" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = tab.name + ".txt";

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  console.log(convertToMarkdown());

  //Auto saving and loading

  function saveToLocalStorage() {
    const tabJSON = JSON.stringify(tab);
    localStorage.setItem("tab", tabJSON);
  }

  function loadFromLocalStorage() {
    const tabJSON = localStorage.getItem("tab");
    if (tabJSON) {
      const tab = JSON.parse(tabJSON);
      setTab(tab);
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage();
    }
  }, [tab]);

  function resetTab() {
    setTab(initTab);
  }

  function changeTuning() {
    setIsTuning(true);
    //Wait .5 seconds for input to render
    setTimeout(() => {
      const tuningInput = document.getElementById("tuning");
      tuningInput.focus();
      tuningInput.onblur = (e) => {
        const tuning = e.target.value.split("").reverse();
        if (!tuning.length < tab.strings) {
          setIsTuning(false);
          return;
        }
        const newTab = { ...tab };
        newTab.tuning = tuning;
        setTab(newTab);
        setIsTuning(false);
      };
    }, 500);
  }

  function updateName(e) {
    //Turn text into input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = e.target.innerText;
    e.target.replaceWith(nameInput);
    nameInput.onFocus = (e) => {
      e.target.select();
    };
    nameInput.focus();

    nameInput.onblur = (e) => {
      const newTab = { ...tab };
      newTab.name = e.target.value;
      setTab(newTab);
      const name = document.createElement("h1");
      name.innerText = e.target.value;
      name.onclick = updateName;
      e.target.replaceWith(name);
    };
  }

  function updateBPM(e) {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = e.target.innerText.split(" ")[0];
    e.target.replaceWith(nameInput);
    nameInput.onFocus = (e) => {
      e.target.select();
    };
    nameInput.focus();

    nameInput.onblur = (e) => {
      const newTab = { ...tab };
      newTab.bpm = e.target.value;
      setTab(newTab);
      const name = document.createElement("p");
      name.innerText = e.target.value + " BPM";
      name.onclick = updateBPM;
      e.target.replaceWith(name);
    };
  }

  function updateKey(e) {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = e.target.innerText;
    e.target.replaceWith(nameInput);
    nameInput.onFocus = (e) => {
      e.target.select();
    };
    nameInput.focus();

    nameInput.onblur = (e) => {
      const newTab = { ...tab };
      newTab.tabKey = e.target.value;
      setTab(newTab);
      const name = document.createElement("p");
      name.innerText = e.target.value;
      name.onclick = updateKey;
      e.target.replaceWith(name);
    };
  }

  function changeStrings(e) {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = tab.strings;
    e.target.replaceWith(nameInput);
    nameInput.onFocus = (e) => {
      e.target.select();
    };
    nameInput.focus();

    nameInput.onblur = (e) => {
      const newTab = { ...tab };
      const newStrings = parseInt(e.target.value, 10);
      if (newStrings > newTab.strings) {
        for (let i = newTab.strings; i < newStrings; i++) {
          newTab.fretboard.push(Array(barLength).fill(new Note()));
        }
      } else if (newStrings < newTab.strings) {
        newTab.fretboard = newTab.fretboard.slice(0, newStrings);
      }
      newTab.strings = newStrings;
      setTab(newTab);
      const name = document.createElement("button");
      name.innerText = "Change Strings";
      name.onclick = changeStrings;
      e.target.replaceWith(name);
    };
  }

  //Keymaps

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" && !isNaN(e.key)) return;
      const platformCtrl = e.ctrlKey || e.metaKey;

      switch (e.key) {
        case "s":
          if (platformCtrl) {
            e.preventDefault();
            saveTab();
            break;
          }
          break;
        //Number tools
        case "1":
          setTool("pen");
          break;
        case "2":
          setTool("eraser");
          break;
        case "3":
          setTool("mute");
          break;
        case "4":
          setTool("slide");
          break;
        case "5":
          setTool("bend");
          break;
        case "6":
          setTool("hammer");
          break;
        case "7":
          setTool("pull");
          break;

        case "ArrowUp":
          setCurrentValue((prevValue) => Number(prevValue) + 1);
          break;
        case "ArrowDown":
          setCurrentValue((prevValue) => Number(prevValue) - 1);
          break;

        case "l":
          if (platformCtrl) {
            e.preventDefault();
            loadTab();
            break;
          }
          break;
        case "n":
          if (platformCtrl) {
            e.preventDefault();
            addBar();
            break;
          }
          break;

        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <h1 onClick={updateName}>{tab.name}</h1>
      <p onClick={updateKey}>{tab.tabKey}</p>
      <p onClick={updateBPM}>{tab.bpm} BPM</p>
      <div className="tools">
        <button
          onClick={handleToolChange}
          value="pen"
          className={tool === "pen" ? "active" : ""}
        >
          Pen
        </button>
        <button
          onClick={handleToolChange}
          value="eraser"
          className={tool === "eraser" ? "active" : ""}
        >
          Eraser
        </button>
        <button
          onClick={handleToolChange}
          value="mute"
          className={tool === "mute" ? "active" : ""}
        >
          Mute
        </button>
        <button
          onClick={handleToolChange}
          value="slide"
          className={tool === "slide" ? "active" : ""}
        >
          Slide
        </button>
        <button
          onClick={handleToolChange}
          value="bend"
          className={tool === "bend" ? "active" : ""}
        >
          Bend
        </button>
        <button
          onClick={handleToolChange}
          value="hammer"
          className={tool === "hammer" ? "active" : ""}
        >
          Hammer
        </button>
        <button
          onClick={handleToolChange}
          value="pull"
          className={tool === "pull" ? "active" : ""}
        >
          Pull
        </button>
      </div>
      <div className="options">
        <button onClick={addBar}>Add Bar</button>
        <button onClick={deleteLastBar}>Delete Bar</button>
        <button onClick={saveTab}>Save</button>
        <button onClick={downloadTabAsText}>Save as Text</button>
        <button onClick={loadTab}>Load</button>
        <button onClick={changeTuning}>Change Tuning</button>
        {isTuning ? (
          <input
            type="text"
            maxLength={tab.strings}
            placeholder="Enter tuning"
            id="tuning"
          />
        ) : null}
        <button onClick={changeStrings}>Change Strings</button>
        <button onClick={resetTab}>Reset</button>
      </div>
      <div className="bar-container">{tabList()}</div>
    </div>
  );
}
