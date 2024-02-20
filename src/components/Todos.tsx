import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateTodo, useUpdateTodo } from "../services/mutations";
import { useDeleteTodo, useTodos, useTodosIds } from "../services/queries";
import { Todo } from "../types/todo";

export default function Todos() {
  const { data, isPending, isError } = useTodosIds();
  const todoQueries = useTodos(data);
  // const isFetching = useIsFetching();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const { register, handleSubmit } = useForm();

  const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
    createTodoMutation.mutate(data);
  };

  const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
    if (data) {
      updateTodoMutation.mutate({ ...data, checked: true });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  if (isPending) {
    return <span>loading...</span>;
  }

  if (isError) {
    return <span>There is an error!</span>;
  }

  return (
    <>
      {/* @ts-expect-error  can't figure out what's wrong*/}
      <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
        <h4>New todo:</h4>
        <input placeholder="Title" {...register("title")} />
        <input placeholder="Description" {...register("description")} />
        <br />
        <input
          type="submit"
          disabled={createTodoMutation.isPending}
          value={createTodoMutation.isPending ? "Creating..." : "Create Todo"}
        />
      </form>
      <ul>
        {todoQueries.map(({ data }) => (
          <li key={data?.id}>
            <div>Id: {data?.id}</div>
            <span>
              <strong>Title: {data?.title}</strong>&nbsp;
              <strong>Description: </strong>
              {data?.description}
            </span>
            <div>
              <button
                onClick={() => handleMarkAsDoneSubmit(data)}
                disabled={data?.checked}
              >
                {data?.checked ? "Done" : "Mark as done"}
              </button>
              {data?.id && (
                <button onClick={() => handleDeleteTodo(data.id!)}>
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
