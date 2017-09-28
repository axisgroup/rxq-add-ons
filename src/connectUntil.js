import { publish, take } from "rxjs/operators";

export default function connectUntil(disconnect$) {
    return (source$) => {

        // Connect source$;
        const pubSource$ = source$.pipe(
            publish()
        );

        const sub = pubSource$.connect();

        disconnect$.pipe(
            take(1)
        )
        .subscribe(()=>{
            sub.unsubscribe();
        });


        return pubSource$;
    }
}