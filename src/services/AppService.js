import { min } from "underscore"

const MILLISECONDS = {
    SECOND: 1000,
    MINUTE: 60*1000,
    HOUR: 60*60*1000,
    DAY: 24*60*60*1000,
    MONTH: 30*24*60*60*1000,
    YEAR: 30*24*60*60*1000,
}

export default class AppService {
    static getGreaterDate = time => {
        if(time < MILLISECONDS.MINUTE)
            return ({
                time: MILLISECONDS.SECOND,
                plural_prefix: 'segundos',
                prefix: 'segundo'
            })
        if(time < MILLISECONDS.HOUR)
            return ({
                time: MILLISECONDS.MINUTE,
                plural_prefix: 'minutos',
                prefix: 'minuto'
            })
        if(time < MILLISECONDS.DAY)
            return ({
                time: MILLISECONDS.HOUR,
                plural_prefix: 'horas',
                prefix: 'hora'
            })
        if(time < MILLISECONDS.MONTH)
            return ({
                time: MILLISECONDS.DAY,
                plural_prefix: 'dias',
                prefix: 'dia'
            })
        if(time < MILLISECONDS.YEAR)
            return ({
                time: MILLISECONDS.MONTH,
                plural_prefix: 'meses',
                prefix: 'mês'
            })
        return ({
            time: MILLISECONDS.YEAR,
            plural_prefix: 'anos',
            prefix: 'ano'
        })
    }
    static calcTimeElapsed = date => {
        // console.log({
        //     now: new Date().getTime(),
        //     diff: date.getTime()
        // })
        let diff = new Date().getTime() - date.getTime()
        let pivot = this.getGreaterDate(diff)
        // console.log({pivot, diff})
        return ({
            ...pivot,
            time: parseInt(diff/pivot.time),
        })
    }
}