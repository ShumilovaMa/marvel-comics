import { useState, useCallback } from "react";

export const useHttp = () => { //http в плане обозначения хука - сущность, которая будет работать с запросами
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async(url, method= 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        
        setLoading(true)

        try {
            const response = await fetch(url, {method, body, headers})

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json()

            setLoading(false)
            return data

        } catch(e) {
            setLoading(false)
            setError(e.message)
            throw e
        }

    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, error, request, clearError}
}
//данный хук позволяет отправлять любые запросы на сервер, обрабатывать полученные результаты и сохранять локальное состояние 