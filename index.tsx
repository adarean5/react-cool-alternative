import { css, h } from './src/createElement';
import { Signal } from './src/state';

type Todo = {
  text: string;
  done: boolean;
  id: number;
};

type TodoItemProps = {
  todo: Todo;
  toggle: () => void;
  remove: () => void;
};

const buttonStyle = { backgroundColor: 'blue' };

const TodoItem = ({ todo, toggle, remove }: TodoItemProps) => {
  const listItemClass = css`
    background-color: red;
  `;
  const textClass = css`
    text-decoration: ${todo.done ? 'line-through' : 'none'};
  `;
  return (
    <li class={listItemClass}>
      <label class={textClass}>
        <input type="checkbox" checked={todo.done} onChange={toggle} />
        {todo.text}
      </label>
      <button onclick={remove} style={buttonStyle}>
        Delete
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 448 512"
        >
          <path
            fill={todo?.done ? 'green' : 'yellow'}
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
          ></path>
        </svg>
      </button>
    </li>
  );
};

const ToDo = () => {
  const [pub, sub] = Signal<Todo[]>([
    {
      text: 'test',
      done: false,
      id: 1,
    },
  ]);
  let inputRef;

  const handleToggle = (id: number) => () => {
    pub((current) =>
      current.map((curEle) =>
        curEle.id == id ? { ...curEle, done: !curEle.done } : curEle
      )
    );
  };

  const handleRemove = (id: number) => () => {
    pub((current) => current.filter((curEle) => curEle.id !== id));
  };

  return (
    <div class="app">
      <h1>The ToDo List</h1>
      <form
        class="todoForm"
        onsubmit={(event) => {
          event.preventDefault();

          pub((current) => {
            const newToDos = current.concat({
              text: inputRef.value,
              done: false,
              id: Date.now() + Math.random(),
            });
            inputRef.value = '';

            return newToDos;
          });
        }}
      >
        <label>What needs to be done?</label>
        <div class="inputContainer">
          <input type="text" name="task" />
          <button type="submit">Add</button>
        </div>
      </form>
      <input />
      <button>Add TODO</button>
      <div>
        <ul
          ref={(listRef) => {
            sub((elements: Todo[]) => {
              console.log(elements);
              listRef.replaceChildren(
                ...elements.map((ele) => (
                  <TodoItem
                    todo={ele}
                    toggle={handleToggle(ele.id)}
                    remove={handleRemove(ele.id)}
                  />
                ))
              );
            });
          }}
        />
      </div>
    </div>
  );
};

const html = <ToDo></ToDo>;

document.body.append(html);
