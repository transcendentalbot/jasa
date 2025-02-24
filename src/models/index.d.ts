import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly character?: string | null;
  readonly gender?: string | null;
  readonly age?: string | null;
  readonly genre?: string | null;
  readonly hasAnimals?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly character?: string | null;
  readonly gender?: string | null;
  readonly age?: string | null;
  readonly genre?: string | null;
  readonly hasAnimals?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Story = LazyLoading extends LazyLoadingDisabled ? EagerStory : LazyStory

export declare const Story: (new (init: ModelInit<Story>) => Story) & {
  copyOf(source: Story, mutator: (draft: MutableModel<Story>) => MutableModel<Story> | void): Story;
}