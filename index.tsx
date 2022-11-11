import { h } from './src/createElement';
import { Signal } from './src/state';

const ToDo = () => {
  const [pub, sub] = Signal([]);
  let inputRef;

  sub(console.log);

  return (
    <div>
      <input ref={(el) => (inputRef = el)} />
      <button
        onclick={() => {
          pub((current) => {
            const newToDos = current.concat({
              text: inputRef.value,
              done: false,
            });

            inputRef.value = '';

            return newToDos;
          });
        }}
      >
        Add TODO
      </button>
      <div>
        <ul>
          <li>Item 1</li>
        </ul>
      </div>
    </div>
  );
};

const html = <ToDo></ToDo>;

document.body.append(html);
