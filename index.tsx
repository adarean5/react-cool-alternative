import { h } from './src/createElement';
import { Signal } from './src/state';

type Todo = {
  text: string;
  done: boolean;
  id: number;
};

type TodoItemProps = {
  todo: Todo;
  toggle: () => void;
};

const TodoItem = ({ todo, toggle }: TodoItemProps) => {
  return (
    <li>
      <label>
        <input type="checkbox" checked={todo.done} onChange={toggle} />
        {todo.text}
      </label>
      <button>Delete</button>
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

  return (
    <div>
      <input ref={(el) => (inputRef = el)} />
      <button
        onclick={() => {
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
        Add TODO
      </button>
      <div>
        <ul
          ref={(listRef) => {
            sub((elements: Todo[]) => {
              console.log(elements);
              listRef.replaceChildren(
                ...elements.map((ele) => (
                  <TodoItem todo={ele} toggle={handleToggle(ele.id)} />
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

document.body.append(render(html));
