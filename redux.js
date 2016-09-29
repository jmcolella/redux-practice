const counter = ( state = 0, action ) => {

  if ( action.type === "INCREMENT" ) {
    return state + 1
  } else if ( action.type === "DECREMENT" ) {
    return state - 1
  } else {
    return state
  }

}

const { createStore } = Redux;

const store = createStore( counter );

const render = () => {
  document.getElementById("text").innerText = store.getState();
}

store.subscribe( render );
render();

const click = ( id, type ) => {
  document.getElementById( id ).addEventListener( 'click', function() {
      store.dispatch( { type: type } )
  });
}

click( "increment", "INCREMENT" );
click( "decrement", "DECREMENT" );





