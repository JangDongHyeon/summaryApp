import axios from 'axios';
import {
    SUMMARY_REQUEST,
    SUMMARY_ERROR,
    REMOVE_ERROR
} from './types';

//요약 보내기
export const summaryRequest = data => async dispatch => {
    try {
        let language = data.language;
        let text = data.text;
        let response;
        if (language === 'kr') {
            let formKorea1 = new FormData();
            formKorea1.append('String', text);
            formKorea1.append('ori', 'kr');
            formKorea1.append('tar', 'en');
            response = await axios.post('https://chat.neoali.com:8072/translate', formKorea1);

            text = response.data

        }

        let form = new FormData();
        form.append('String', text);
        response = await axios.post(`https://chat.neoali.com:8072/summary_short`, form);
        text = response.data;
        if (language === 'kr') {
            let formKorea2 = new FormData();
            formKorea2.append('String', text);
            formKorea2.append('ori', 'en');
            formKorea2.append('tar', 'kr');
            response = await axios.post('https://chat.neoali.com:8072/translate', formKorea2)
        }
        text = response.data;
        dispatch({
            type: SUMMARY_REQUEST,
            payload: text
        });

    } catch (error) {

        dispatch({
            type: SUMMARY_ERROR,
            payload: '새로고침 후 다시 시도해주세요.'
        });

        dispatch({
            type: REMOVE_ERROR,
            payload: null
        })
    }
};