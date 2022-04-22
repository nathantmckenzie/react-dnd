import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";
import "./TierList.css";

const itemsFromBackend = [
  { id: uuid(), img: "./img/michael-jordan.jpeg" },
  { id: uuid(), img: "./img/wilt-chamberlain.jpeg" },
  { id: uuid(), img: "./img/lebron.png" },
  { id: uuid(), img: "./img/magic.jpeg" },
  { id: uuid(), img: "./img/kareem.jpeg" },
];

const columnsFromBackend = {
  [uuid()]: {
    name: "S",
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: "A",
    items: [],
  },
  [uuid()]: {
    name: "B",
    items: [],
  },
  [uuid()]: {
    name: "C",
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  console.log("result", result);
  console.log("columns", columns);
  console.log("setColumns", setColumns);
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]; // sourceColumn = {name: "S", items: [everything]}
    const destColumn = columns[destination.droppableId]; // destColumn = {name: "A", items: []}
    const sourceItems = [...sourceColumn.items]; // sourceItems = {name: "S", items: [everything]} (copy of source)
    const destItems = [...destColumn.items]; // destItems = {name: "A", items: []} (copy of destination)
    const [removed] = sourceItems.splice(source.index, 1); // {id: xyz, img: "./img/lebron.png"}
    destItems.splice(destination.index, 0, removed); //so I just discovered that you can push an element into a specific index using the splice method
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
        border: 100,
      }}
    >
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 10, marginLeft: 100 }}>
                <Droppable droppableId={columnId} key={columnId} direction="horizontal">
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                          padding: 4,
                          width: 1300,
                          minHeight: 200,
                          display: "flex",
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <img
                                      src={require(`${item.img}`)}
                                      width="200"
                                      height="200"
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
