interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  text: string;
  bgColor?: string;
  color?: string;
  classes: string;
}

export const Buttons: React.FC<ButtonProps> = ({
  text = "",
  bgColor = "bg-indigo-600",
  color = "text-white",
  type = "button",
  classes = "",
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={`${bgColor} ${color} ${classes} rounded-md`}
    >
      {text}
    </button>
  );
};
