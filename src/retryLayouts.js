import { invalidated } from "rxq/operators/handle";
import { getLayout } from "rxq/operators/genericobject";
import { map, windowCount, catchError, switchAll, retryWhen, delay, take } from "rxjs/operators";
import { empty } from "rxjs/observable/empty";

export default function retryLayouts(n = 3, t = 100, silentError = true) {
    return (source$) => {

        return source$.pipe(
            invalidated(),
            windowCount(1),
            map(obs$ => obs$.pipe(
                getLayout(),
                retryWhen(err => err.pipe(
                    delay(t),
                    take(n)
                )),
                catchError(err => silentError ? empty() : err)
            )),
            switchAll()
        );
        
    }
}