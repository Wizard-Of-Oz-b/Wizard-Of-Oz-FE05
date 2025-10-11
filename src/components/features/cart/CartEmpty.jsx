
export default function CartEmpty({script = '장바구니가 비었습니다'}){


  return(
    <tr>
      <td colSpan={5} className="bg-gray-300 rounded-sm text-center text-xl">
        {script}
      </td>
    </tr>
  )
}