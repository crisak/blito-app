/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $condition: ModelCategoryConditionInput
    $input: CreateCategoryInput!
  ) {
    createCategory(condition: $condition, input: $input) {
      createdAt
      description
      id
      name
      owner
      updatedAt
      __typename
    }
  }
`;
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $condition: ModelCategoryConditionInput
    $input: DeleteCategoryInput!
  ) {
    deleteCategory(condition: $condition, input: $input) {
      createdAt
      description
      id
      name
      owner
      updatedAt
      __typename
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $condition: ModelCategoryConditionInput
    $input: UpdateCategoryInput!
  ) {
    updateCategory(condition: $condition, input: $input) {
      createdAt
      description
      id
      name
      owner
      updatedAt
      __typename
    }
  }
`;
