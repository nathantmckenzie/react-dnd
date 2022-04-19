import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import uuid from "uuid/v4";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
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
  const [addInput, setAddInput] = useState();
  const [editInput, setEditInput] = useState("");

  const [items, setItems] = useState([
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
    { id: uuid(), content: "Fourth task" },
    { id: uuid(), content: "Fifth task" },
  ]);

  const [columns, setColumns] = useState({
    [uuid()]: {
      name: "Requested",
      items: items,
    },
    [uuid()]: {
      name: "To do",
      items: [],
    },
    [uuid()]: {
      name: "In Progress",
      items: [],
    },
    [uuid()]: {
      name: "Done",
      items: [],
    },
  });

  const showEditBoolean = items.map((item) => ({ [item.id]: false }));
  const [showEditInput, setShowEditInput] = useState(showEditBoolean);

  const addTodo = (e) => {
    e.preventDefault();
    setItems((prevState) => [...prevState, { id: uuid(), content: addInput }]);
  };

  const showEdit = (id) => {
    setShowEditInput((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const editTodo = (id) => {
    console.log("hi", id);
    const updatedItems = items.map((item) =>
      item.id === id ? { id: item.id, content: editInput } : { ...item }
    );
    setItems(updatedItems);
    setShowEditInput((prevState) => ({ ...prevState, [id]: false }));
    setEditInput("");
    // setItems((prevState) => [...prevState, { id: id, content: editInput }]);
  };

  React.useEffect(() => {
    const getId = () => {
      for (let id in columns) {
        if (columns[id].name === "Requested") return id;
      }
    };

    setColumns((prevState) => ({
      ...prevState,
      [getId()]: {
        name: "Requested",
        items: items,
      },
    }));
  }, [items]);

  return (
    <div>
      <input
        placeholder="Add Todo"
        value={addInput}
        onChange={(e) => setAddInput(e.target.value)}
      />
      <button onClick={(e) => addTodo(e)}>Add Todo</button>
      <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      onDoubleClick={() => showEdit(item.id)}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: "none",
                                        padding: 16,
                                        margin: "0 0 8px 0",
                                        minHeight: "50px",
                                        backgroundColor: snapshot.isDragging
                                          ? "#263B4A"
                                          : "#456C86",
                                        color: "white",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {showEditInput[item.id] ? (
                                        <input
                                          placeholder="Update Todo"
                                          value={editInput}
                                          onChange={(e) => setEditInput(e.target.value)}
                                          onKeyPress={(e) =>
                                            e.key === "Enter" ? editTodo(item.id) : null
                                          }
                                        />
                                      ) : (
                                        item.content
                                      )}
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
    </div>
  );
}

export default App;
