import { h } from "./src/createElement";
import { Signal } from "./src/state";

type ToDO = {
  text: string
  done: boolean
  id: number
}

const ToDo = () => {
  const [pub, sub] = Signal<ToDO[]>([]);
  let inputRef;
  let listRef;

  sub((elements) => {
    console.log(elements);
    listRef.replaceChildren(...elements.map((ele) => <li onclick={() => { pub(current => current.map(curEle => curEle.id == ele.id ? {...curEle, done: !ele.done} : curEle )) }}>{ele.text}</li>));
  });

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

            inputRef.value = "";

            return newToDos;
          });
        }}
      >
        Add TODO
      </button>
      <div>
        <ul ref={(el) => (listRef = el)} />
      </div>
    </div>
  );
};

const html = <ToDo></ToDo>;

document.body.append(html);
