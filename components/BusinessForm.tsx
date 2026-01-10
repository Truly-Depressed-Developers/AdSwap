'use client';

import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { trpc } from '@/trpc/client';
import { TagDTO } from '@/types/dtos';
import {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox';

const businessFormSchema = z.object({
  nip: z.string().length(10, 'NIP musi mieć dokładnie 10 cyfr'),
  name: z.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  address: z.string().min(5, 'Adres musi mieć co najmniej 5 znaków'),
  description: z.string().min(10, 'Opis musi mieć co najmniej 10 znaków'),
  pkd: z.string().min(2, 'Podaj kod PKD'),
  latitude: z.number({
    message: 'Podaj poprawną liczbę',
  }),
  longitude: z.number({
    message: 'Podaj poprawną liczbę',
  }),
  website: z.url('Podaj poprawny adres URL strony').optional(),
  tags: z.array(z.string()).min(1, 'Wybierz co najmniej jeden tag'),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

export default function BusinessForm() {
  const { data: tags, isPending, isError } = trpc.tag.list.useQuery();

  if (isPending) {
    return <div>Ładowanie tagów...</div>;
  }

  if (isError) {
    return <div>Błąd podczas ładowania tagów</div>;
  }

  return <BusinessFormInner tags={tags || []} />;
}

function BusinessFormInner({ tags }: { tags: TagDTO[] }) {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      address: '',
      description: '',
      nip: '',
      pkd: '',
      tags: [],
      latitude: undefined,
      longitude: undefined,
    },
  });

  const onSubmit = async (data: BusinessFormValues) => {
    try {
      console.log('Business Form Data:', data);
      // await createBusiness(data);
    } catch (error) {
      console.error('Błąd podczas tworzenia biznesu:', error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nazwa biznesu</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="np. Restauracja u Jacka"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="nip"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>NIP</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="1234567890"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>10 cyfr bez spacji i myślników</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Adres</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="ul. Główna 1, 00-001 Warszawa"
                  aria-invalid={fieldState.invalid}
                />
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
                  placeholder="Krótki opis Twojej działalności..."
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Opisz czym zajmuje się Twój biznes</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="pkd"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kod PKD</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="np. 56.10.A"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Strona WWW</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="https://example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="latitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Szerokość geograficzna (Latitude)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    placeholder="52.2297"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                    value={field.value === undefined || isNaN(field.value) ? '' : field.value}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="longitude"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Długość geograficzna (Longitude)</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    step="any"
                    placeholder="21.0122"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)
                    }
                    value={field.value === undefined || isNaN(field.value) ? '' : field.value}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="tags"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Tagi</FieldLabel>
                <Combobox
                  multiple
                  value={field.value}
                  onValueChange={field.onChange}
                  name={field.name}
                >
                  <ComboboxChips id={field.name} aria-invalid={fieldState.invalid}>
                    {field.value.map((val) => {
                      const tag = tags.find((t) => t.id === val);
                      return (
                        <ComboboxChip key={val} value={val}>
                          {tag?.name || val}
                        </ComboboxChip>
                      );
                    })}
                    <ComboboxChipsInput placeholder="Wybierz tagi..." />
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxList>
                      {tags?.map((tag) => (
                        <ComboboxItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>Nie znaleziono tagów</ComboboxEmpty>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldDescription>Wybierz tagi najlepiej opisujące Twój biznes</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Utwórz profil biznesowy
        </Button>
      </div>
    </form>
  );
}
