'use client';

import { useMemo } from 'react';
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

const createAdspaceFormSchema = (typeIds: [string, ...string[]]) =>
  z.object({
    name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
    description: z.string().optional(),
    type: z.enum(typeIds, {
      message: 'Wybierz poprawny typ',
    }),
    maxWidth: z.number({ message: 'Podaj liczbę' }),
    maxHeight: z.number({ message: 'Podaj liczbę' }),
    isBarterAvailable: z.boolean(),
    pricePerDay: z.number({ message: 'Podaj liczbę' }).optional(),
  });

export default function AdspaceForm() {
  const { data: types, isPending, isError } = trpc.adspace.types.useQuery();
  const { mutateAsync: createAdspace } = trpc.adspace.create.useMutation();

  const schema = useMemo(
    () =>
      createAdspaceFormSchema(
        types && types.length > 0
          ? (types.map((t) => t.id) as [string, ...string[]])
          : ['placeholder'],
      ),
    [types],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      isBarterAvailable: false,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    createAdspace(data);
  };

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError) {
    return <div>Błąd podczas ładowania typów</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-6">
        <div className="space-y-4">
          <Field>
            <FieldLabel>Nazwa powierzchni reklamowej</FieldLabel>
            <Input placeholder="np. Billboard centrum - Główna ulica" {...register('name')} />
            <FieldDescription>
              Opisowa nazwa identyfikująca tę powierzchnię reklamową
            </FieldDescription>
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Opis</FieldLabel>
            <Textarea
              placeholder="Lokalizacja o dużym natężeniu ruchu z doskonałą widocznością..."
              {...register('description')}
            />
            <FieldDescription>
              Dodatkowe szczegóły dotyczące lokalizacji, widoczności lub specjalnych cech
              (opcjonalnie)
            </FieldDescription>
            <FieldError>{errors.description?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>Typ powierzchni reklamowej</FieldLabel>
            <div className="w-full">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
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
                )}
              />
            </div>
            <FieldError>{errors.type?.message}</FieldError>
          </Field>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Wymiary reklamy</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Maksymalna szerokość</FieldLabel>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="100"
                      {...register('maxWidth', { valueAsNumber: true })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                  <FieldError>{errors.maxWidth?.message}</FieldError>
                </Field>

                <Field>
                  <FieldLabel>Maksymalna wysokość</FieldLabel>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="150"
                      {...register('maxHeight', { valueAsNumber: true })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      cm
                    </span>
                  </div>
                  <FieldError>{errors.maxHeight?.message}</FieldError>
                </Field>
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
                <Field>
                  <FieldLabel>Stawka dzienna</FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      PLN
                    </span>
                    <Input
                      type="number"
                      placeholder="99.00"
                      min="0"
                      className="pl-10.5"
                      step="0.01"
                      {...register('pricePerDay', { valueAsNumber: true })}
                    />
                  </div>
                  <FieldDescription>
                    Cena za dzień dla tej powierzchni reklamowej (opcjonalnie)
                  </FieldDescription>
                  <FieldError>{errors.pricePerDay?.message}</FieldError>
                </Field>

                <Field
                  orientation="horizontal"
                  className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4"
                >
                  <span className="inline-block shrink-0">
                    <Controller
                      control={control}
                      name="isBarterAvailable"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="barter"
                          className="mt-1"
                        />
                      )}
                    />
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <FieldLabel htmlFor="barter" className="font-medium cursor-pointer">
                      Akceptuj wymianę barterową
                    </FieldLabel>
                    <FieldDescription className="text-sm">
                      Pozwól reklamodawcom proponować umowy handlowe lub wymienne zamiast płatności
                      pieniężnej
                    </FieldDescription>
                  </div>
                </Field>
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
