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

  const [tab, setTab] = useState({
    strings: 6,
    tuning: ["E", "B", "G", "D", "A", "E"],
    barLength: 32,
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
  });

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
                    onFocus={(e) => {
                      e.target.select();
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

  //   useEffect(() => {
  //     const intervalId = setInterval(saveToLocalStorage, 30000); // 30 seconds

  //     // Clean up the interval on unmount
  //     return () => clearInterval(intervalId);
  //   }, []);

  useEffect(() => {
    if (isLoaded) {
      saveToLocalStorage();
    }
  }, [tab]);

  function changeTuning() {
    setIsTuning(true);
    //Wait .5 seconds for input to render
    setTimeout(() => {
      const tuningInput = document.getElementById("tuning");
      tuningInput.focus();
      tuningInput.onblur = (e) => {
        const tuning = e.target.value.split("").reverse();

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

  //Keymaps

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;

      switch (e.key) {
        case "p":
          setTool("pen");
          break;
        case "e":
          setTool("eraser");
          break;
        case "m":
          setTool("mute");
          break;
        case "s":
          if (e.ctrlKey) {
            saveTab();
            break;
          }
          setTool("slide");
          break;
        case "b":
          setTool("bend");
          break;
        case "h":
          setTool("hammer");
          break;
        case "u":
          setTool("pull");
          break;
        case "l":
          if (e.ctrlKey) {
            loadTab();
            break;
          }
          break;
        case "n":
          if (e.ctrlKey) {
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
        <button onClick={saveTab}>Save</button>
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
      </div>
      <div className="bar-container">{tabList()}</div>
    </div>
  );
}
