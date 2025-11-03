import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

const PrimaryInput = ({ onChange, type, className, name, id }: { onChange?: ChangeEventHandler<HTMLInputElement> | undefined, type?: HTMLInputTypeAttribute | undefined, className?: string, name?: string | undefined, id? : string | undefined }) => {
    return <input id={id} name={name} type={type ? type : "text"} onChange={onChange} className={`p-1 px-2 rounded-xl border ${className} `} />
}

export default PrimaryInput;
