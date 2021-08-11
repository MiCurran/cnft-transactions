import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../store/environment/environment.actions';
import { NotificationType } from '../../store/notifications/notifications.initialState';
import notification from '../../lib/generalNotification';
import { logout } from '../../store/auth/auth.actions';
import { useRouter } from 'next/router';

const useRest = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const auth = useSelector(state => state.auth);
    const { showNotification } = notification();

    const makeCall = async (type, path, body, options) => {
        let callResults = {};
        const Authorization = auth.token ? `Bearer ${auth.token}` : '';
        const params = {
            noCache: true,
            headers: {
                Authorization,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache'
            }
        };

        try {
            if (options?.showLoading) {
                dispatch(showLoading());
            }

            switch (type) {
                case 'GET':
                    callResults = await axios.get(path, params);
                    break;
                case 'POST':
                    callResults = await axios.post(path, body, params);
                    break;
                case 'PUT':
                    callResults = await axios.put(path, body, params);
                    break;
                case 'DELETE':
                    callResults = await axios.delete(path, params);
                    break;
            }

            if (options?.showLoading) {
                dispatch(hideLoading());
            }

            if (callResults.request.status === 200 && callResults?.data.success === false) {
                showNotification(NotificationType.ERROR,
                    true,
                    callResults.data.message || options.errorMessage || 'Error making call.');
            }

            return callResults;
        } catch (e) {
            if (options?.showLoading) {
                dispatch(hideLoading());
            }

            const errorMessage = e?.response?.data.message;
            if (e?.response?.status === 401 && (errorMessage === 'jwt expired' || errorMessage === 'jwt malformed')) {
                dispatch(logout());
                router.push('/');
            } else {
                showNotification(NotificationType.ERROR,
                    true,
                    callResults.data.message || options.errorMessage || 'Error making call.');
            }
            return (e);
        }
    };

    const restGet = (path, options) => {
        return makeCall('GET', path, null, options);
    };

    const restPut = async (path, body, options) => {
        return makeCall('PUT', path, body, options);
    };

    const restPost = (path, body, options) => {
        return makeCall('POST', path, body, options);
    };

    const restDelete = (path, options) => {
        return makeCall('DELETE', path, null, options);
    };

    return {
        restGet,
        restPut,
        restPost,
        restDelete
    };
};

export default useRest;
