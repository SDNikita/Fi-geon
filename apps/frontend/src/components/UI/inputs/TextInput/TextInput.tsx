import Input from '../Input/Input';
import type { InputProps } from '../Input/Input';

type TextInputProps = Omit<InputProps, 'type'> & {
    type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
};

function TextInput({
    type = 'text',
    ...props
}: TextInputProps) {
    return <Input {...props} type={type} />;
}

export default TextInput;