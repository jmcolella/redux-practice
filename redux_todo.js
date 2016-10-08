// separating out reducer to handle single ToDo
const todo = ( state, action ) => {
  switch ( action.type ) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if ( state.id !== action.id ) {
        return state
      }

      return Object.assign({}, state,{
        completed: !state.completed
      });
    default:
      return state;
  }
};

const todos = ( state = [], action ) => {
  switch ( action.type ) {
    case 'ADD_TODO':
      return state.concat(todo( undefined, action ));
    case 'TOGGLE_TODO':
      return state.map( t => todo(t, action) );
    default:
      return state
  }
};

const visibilityFilter = ( state = "SHOW_ALL", action ) => {
  switch ( action.type ) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  };
};

const { combineReducers } = Redux;
// const combineReducers = ( reducers ) => {
//   return (state = {}, action) => {
//     return Object.keys(reducers).reduce(
//       (nextState, key) => {
//         nextState[key] = reducers[key](
//           state[key],
//           action
//         );
//         return nextState;
//       },
//       {}
//     );
//   };
// };
const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});
// const todoApp = ( state = {}, action ) => {
//   return {
//     todos: todos(
//       state.todos,
//       action
//     ),
//     visibilityFilter: visibilityFilter(
//       state.visibilityFilter,
//       action
//     )
//   };
// };

const { Component } = React;

const getVisibleTodos = (
  todos,
  filter
) => {
  switch ( filter ) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
};


let nextTodoId = 0;
const AddTodo = (props, { store }) => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
        }} />
        <button onClick={() => {
          store.dispatch({
            type: "ADD_TODO",
            id: nextTodoId++,
            text: input.value
          });
          input.value = '';
        }}>
          Add Todo
        </button>
    </div>
  )
};
AddTodo.contextTypes = {
  store: React.PropTypes.object
};


class VisibleTodoList extends Component {
  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render () {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={(id) =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        } />
    )
  }
};
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
};

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {
      todos.map(todo =>
        <Todo
          key={todo.id}
          completed={todo.completed}
          text={todo.text}
          onClick={() => onTodoClick(todo.id)} />
      )
    }
  </ul>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}
  >
    {text}
   </li>
);

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >All
    </FilterLink>
    {' '}
    <FilterLink
      filter="SHOW_ACTIVE"
    >Active
    </FilterLink>
    {' '}
    <FilterLink
      filter="SHOW_COMPLETED"
    >completed
    </FilterLink>
  </p>
);

class FilterLink extends Component {
  componentDidMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render () {
    const props = this.props;
    const {store} = this.context;
    const state = store.getState();

    return (
      <Link
        active={
          props.filter === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
      >
        { props.children }
      </Link>
    );
  }
};
FilterLink.contextTypes = {
  store: React.PropTypes.object
};

const Link = ({
  active,
  children,
  onClick
}) => {
  if ( active ) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
       onClick={e => {
          e.preventDefault();
          onClick();
       }}
    >
      {children}
    </a>
  )
};



const TodoApp = () => (
  <div>
    <AddTodo />

    <VisibleTodoList />

    <Footer />
  </div>
);

class Provider extends Component {
  getChildContext() {
    return {
      store: this.props.store
    }
  }
  render () {
    return this.props.children;
  }
};

Provider.childContextTypes = {
  store: React.PropTypes.object
};

const { createStore } = Redux;


ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('text')
);

// console.log("Initial State:");
// console.log( store.getState() );

// console.log("Dispatching ADD_TODO:");
// store.dispatch({
//   type: "ADD_TODO",
//   id: 0,
//   text: 'Learn Redux'
// });

// console.log(store.getState());

// console.log("Dispatching TOGGLE_TODO:");
// store.dispatch({
//   type:"TOGGLE_TODO",
//   id: 0
// });

// console.log(store.getState());



