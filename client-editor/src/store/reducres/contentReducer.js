const initialState = {
    contents: [],
    loading: false,
    error: null,
    currentContent: null
};

export const contentReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_CONTENT_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'CREATE_CONTENT_SUCCESS':
            return {
                ...state,
                loading: false,
                contents: [...state.contents, action.payload],
                error: null
            };
        case 'CREATE_CONTENT_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'GET_CONTENT_REQUEST':
        case 'UPDATE_CONTENT_REQUEST':
        case 'DELETE_CONTENT_REQUEST':
            return {
                ...state,
                loading: true
            };
        case 'GET_CONTENT_SUCCESS':
            return {
                ...state,
                loading: false,
                contents: action.payload,
                error: null
            };
        case 'UPDATE_CONTENT_SUCCESS':
            return {
                ...state,
                loading: false,
                contents: state.contents.map(content =>
                    content._id === action.payload._id ? action.payload : content
                ),
                error: null
            };
        case 'DELETE_CONTENT_SUCCESS':
            return {
                ...state,
                loading: false,
                contents: state.contents.filter(content => content._id !== action.payload),
                error: null
            };
        case 'GET_CONTENT_FAIL':
        case 'UPDATE_CONTENT_FAIL':
        case 'DELETE_CONTENT_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
