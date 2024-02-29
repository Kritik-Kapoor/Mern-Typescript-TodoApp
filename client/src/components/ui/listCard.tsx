import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ListCardProps {
  data: {
    _id: string;
    title: string;
    todos: [{ todo: string; _id: string }];
    status: number;
  };
  deleteList: (listId: string) => void;
}

//Remove the link tag for ListCard from Lists.tsx
//Remove delete icon
//Create context-menu, add options - 1. Editing title 2. Editing Todos (redirect to todos page) 3. Editing Date 4. Mark as completed 5. Delete List

const ListCard: React.FC<ListCardProps> = ({ data, deleteList }) => {
  return (
    <Card className="bg-white hover:bg-[#004670] hover:text-white hover:scale-105 duration-1000">
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-x-3">
          <span className="text-lg">{data.title}</span>
          <span>
            {data.status === 0 ? (
              <i className="fa-regular fa-circle fa-2xs"></i>
            ) : (
              <i
                className="fa-solid fa-circle fa-2xs"
                style={{ color: "#63E6BE" }}
              ></i>
            )}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.todos ? (
          data.todos
            ?.slice(0, 2)
            ?.map((todo) => <p key={todo._id}>{todo.todo}</p>)
        ) : (
          <p>No Todo Added</p>
        )}
      </CardContent>
      <CardFooter className="flex itemscenter justify-between">
        <p>1 May - End Date</p>
        <i
          className="fa-solid fa-trash fa-xl ms-5 text-red-500 cursor-pointer z-10"
          onClick={() => deleteList(data._id)}
        ></i>
      </CardFooter>
    </Card>
  );
};

export default ListCard;
