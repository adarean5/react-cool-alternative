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

const TodoItem = ({ todo, toggle, remove }: TodoItemProps) => {
  const textClass = css`
    text-decoration: ${todo.done ? 'line-through' : 'none'};
  `;
  return (
    <li class="toDoItem">
      <label class={textClass}>
        <input type="checkbox" checked={todo.done} onChange={toggle} />
        {todo.text}
      </label>
      <button class="iconButton" onclick={remove}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 448 512"
        >
          <path
            fill={todo?.done ? 'green' : 'currentColor'}
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
          ></path>
        </svg>
      </button>
    </li>
  );
};

const todosKey = 'todos';

interface Storage<T> {
  load: () => Promise<T[]>;
  save: (value: T[]) => Promise<void>;
}

const localStorageStorage: Storage<Todo> = {
  load: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        resolve(JSON.parse(localStorage.getItem(todosKey) ?? '[]'));
      }, 500)
    ),
  save: (data) =>
    Promise.resolve(localStorage.setItem(todosKey, JSON.stringify(data))),
};

const ToDo = () => {
  const [pub, sub] = Signal<Todo[]>([]);
  const [setIsLoading, getIsLoading] = Signal<boolean>(true);
  localStorageStorage.load().then((data) => {
    setIsLoading(false);
    pub(data);
  });

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

  sub(localStorageStorage.save, false);

  return (
    <div class="app">
      <h1>The ToDo List</h1>
      <form
        class="todoForm"
        onsubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const todoName = formData.get('task') as string;

          if (!todoName?.length) return;

          pub((current) => {
            const newToDos = current.concat({
              text: todoName,
              done: false,
              id: Date.now() + Math.random(),
            });
            event.target.reset();

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
      <div>
        <div
          ref={(loaderRef) => {
            getIsLoading((loading) => {
              loaderRef.style.display = loading ? 'block' : 'none';
            });
          }}
        >
          Loading ...
        </div>
        <ul
          ref={(listRef) => {
            sub((elements: Todo[]) => {
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
