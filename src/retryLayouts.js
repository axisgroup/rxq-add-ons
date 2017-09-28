import { invalidated } from "rxq/operators/handle";
import { getLayout } from "rxq/operators/genericobject";
import { map, catchError, retryWhen, delay, take, switchMap } from "rxjs/operators";
import { empty } from "rxjs/observable/empty";

export default function retryLayouts(n = 3, t = 100, silentError = true) {
    return (source$) => {

        return source$.pipe(
            invalidated(),
            switchMap(handle => {
                var layout$ = handle.call(getLayout());

                return layout$.pipe(
                    retryWhen(err => err.pipe(
                        delay(t),
                        take(n)
                    )),
                    catchError(err => silentError ? empty() : err)
                )
            })
        );
        
    }
}