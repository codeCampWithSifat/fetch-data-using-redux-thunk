const { default: axios } = require("axios");
const { createStore, applyMiddleware } = require("redux");
const thunk = require('redux-thunk').default;

//  CONST 
const GET_TODOS_REQUEST = "GET_TODOS_REQUEST";
const  GET_TODOS_SUCCESS = 'GET_TODOS_SUCCESS';
const GET_TODOS_FAILURE = 'GET_TODOS_FAILED';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

//states
const initialTodosState = {
    todos : [],
    isLoading : false,
    error: null 
}

//action
const getTodosRequest = () => {
    return {
        type : GET_TODOS_REQUEST
    }
};

const getTodosFailed = (error) => {
    return {
        type : GET_TODOS_FAILURE,
        payload : error
    }
};

const getTodosSuccess= (todos) => {
    return {
        type : GET_TODOS_SUCCESS,
        payload : todos,
    }
}

//reducers
const todosReducer = (state=initialTodosState, action) => {
    switch (action.type) {
        case GET_TODOS_REQUEST:
            return {
                ...state,
                isloading : true,
            };
        case GET_TODOS_SUCCESS :
            return {
                ...state,
                isloading : false,
                todos : action.payload
            };
        case GET_TODOS_FAILURE:
            return {
                ...state,
                isloading : false,
                error : action.payload
            };
        default:
            return state;
    }
};

// async actino creator
const fetchData = () => {
    return (dispatch) => {
        dispatch(getTodosRequest());
        axios(API_URL)
        .then(res => {
            const todos = res.data ;
            const titles = todos.map(todo => todo.title);
            // console.log("title",titles);
            dispatch(getTodosSuccess(titles))
        })
        .catch(error => {
            // console.log(error.message);
            const errorMessage = error.message;
            dispatch(getTodosFailed(errorMessage))
        })
    }
}

// store
const store = createStore(todosReducer,applyMiddleware(thunk));
store.subscribe(() => {
    console.log(store.getState())
});
store.dispatch(fetchData())
