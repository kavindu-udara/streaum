import React, { Dispatch, SetStateAction } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import { SelectorItem } from '../../../types';

const Selector = ({items, setItems, placeholder = "", value , setValue} : {items : SelectorItem[], setItems : Dispatch<SetStateAction<{
    label: string;
    value: string;
}[]>>, placeholder? : string, value : string , setValue : React.Dispatch<React.SetStateAction<string>>}) => {

  const [open, setOpen] = React.useState(false);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      style={{ borderColor: '#ccc', marginTop : 20}}
    />
  )
}

export default Selector
