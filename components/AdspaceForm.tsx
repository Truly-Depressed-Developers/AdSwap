'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { trpc } from '@/trpc/client';
import { AdspaceTypeDTO } from '@/types/dtos';

const createAdspaceFormSchema = (typeIds: [string, ...string[]]) =>
  z.object({
    name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
    description: z.string().optional(),
    type: z.enum(typeIds, {
      message: 'Wybierz poprawny typ',
    }),
    maxWidth: z
      .number({
        message: 'Podaj poprawną liczbę',
      })
      .min(1, 'Szerokość musi być większa od 0'),
    maxHeight: z
      .number({
        message: 'Podaj poprawną liczbę',
      })
      .min(1, 'Wysokość musi być większa od 0'),
    isBarterAvailable: z.boolean(),
    pricePerWeek: z
      .number({
        message: 'Podaj poprawną liczbę',
      })
      .min(0, 'Cena nie może być ujemna')
      .or(z.literal(NaN))
      .transform((v) => (isNaN(v as number) ? undefined : v))
      .optional(),
  });

export default function AdspaceForm() {
  const { data: types, isPending, isError } = trpc.adspace.types.useQuery();

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Błąd podczas ładowania typów</div>;
  }

  return <AdspaceFormInner types={types} />;
}

function AdspaceFormInner({ types }: { types: AdspaceTypeDTO[] }) {
  const router = useRouter();
  const { mutateAsync: createAdspace } = trpc.adspace.create.useMutation();

  const typeIds = useMemo(() => types.map((t) => t.id) as [string, ...string[]], [types]);

  const schema = useMemo(() => createAdspaceFormSchema(typeIds), [typeIds]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      isBarterAvailable: false,
      maxWidth: undefined,
      maxHeight: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await createAdspace(data);
      router.push('/my-offers');
    } catch (error) {
      console.error('Błąd podczas tworzenia powierzchni reklamowej:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-6">
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nazwa powierzchni reklamowej</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="np. Billboard centrum - Główna ulica"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Opisowa nazwa identyfikująca tę powierzchnię reklamową
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Opis</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Lokalizacja o dużym natężeniu ruchu z doskonałą widocznością..."
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Dodatkowe szczegóły dotyczące lokalizacji, widoczności lub specjalnych cech
                  (opcjonalnie)
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Typ powierzchni reklamowej</FieldLabel>
                <div className="w-full">
                  <Select onValueChange={field.onChange} value={field.value} name={field.name}>
                    <SelectTrigger
                      id={field.name}
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Wybierz typ powierzchni reklamowej" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Wymiary reklamy</h3>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="maxWidth"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Maksymalna szerokość</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          placeholder="100"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber,
                            )
                          }
                          value={field.value === undefined || isNaN(field.value) ? '' : field.value}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          cm
                        </span>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="maxHeight"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Maksymalna wysokość</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          placeholder="150"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber,
                            )
                          }
                          value={field.value === undefined || isNaN(field.value) ? '' : field.value}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          cm
                        </span>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
              <FieldDescription className="mt-2">
                Określ maksymalne wymiary reklamy w centymetrach
              </FieldDescription>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cennik i opcje</h3>
              <div className="space-y-4">
                <Controller
                  control={form.control}
                  name="pricePerWeek"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Stawka tygodniowa</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          PLN
                        </span>
                        <Input
                          {...field}
                          id={field.name}
                          type="number"
                          placeholder="99.00"
                          min="0"
                          className="pl-10.5"
                          step="0.01"
                          aria-invalid={fieldState.invalid}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : e.target.valueAsNumber,
                            )
                          }
                          value={field.value === undefined || isNaN(field.value) ? '' : field.value}
                        />
                      </div>
                      <FieldDescription>
                        Cena za tydzień dla tej powierzchni reklamowej (opcjonalnie)
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="isBarterAvailable"
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4"
                      data-invalid={fieldState.invalid}
                    >
                      <span className="inline-block shrink-0">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id={field.name}
                          className="mt-1"
                          aria-invalid={fieldState.invalid}
                        />
                      </span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <FieldLabel htmlFor={field.name} className="font-medium cursor-pointer">
                          Akceptuj wymianę barterową
                        </FieldLabel>
                        <FieldDescription className="text-sm">
                          Pozwól reklamodawcom proponować umowy handlowe lub wymienne zamiast
                          płatności pieniężnej
                        </FieldDescription>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Utwórz powierzchnię reklamową
        </Button>
      </div>
    </form>
  );
}
