import { JSONParser } from "formidable/parsers";

let x = 0;

let error = {
    msg : "",
    isError : false
}

class MyError extends Error {
    private myError : { msg: string, isError: boolean};

    constructor(myError:{ msg: string, isError: boolean}) {
        super()

        this.myError = myError

    }

    insertMyError(error : { msg: string, isError: boolean}) {
        this.myError = error
    }

    getMyError() {
        return this.myError
    }
}

try {

    if (x == 1) {
        error.isError = true
        error.msg = "x = 1"
        throw new MyError(error)
    }

} catch(err) {

    console.log(err instanceof MyError)

    console.error((err as MyError).getMyError())

}