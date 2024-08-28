// import { AbilityBuilder, Ability } from '@casl/ability'

// export const AppAbility = Ability

// /**
//  * Please define your own Ability rules according to your app requirements.
//  * We have just shown Admin and Client rules for demo purpose where
//  * admin can manage everything and client can just visit ACL page
//  */
// const defineRulesFor = (role, subject) => {
//   const { can, rules } = new AbilityBuilder(AppAbility)
//   if (role === 'admin') {
//     can('manage', 'all')
//   } else if (role === 'client') {
//     can(['read'], 'acl-page')
//   } else {
//     can(['read', 'create', 'update', 'delete'], subject)
//   }

//   return rules
// }

// export const buildAbilityFor = (role, subject) => {
//   return new AppAbility(defineRulesFor(role, subject), {
//     // https://casl.js.org/v5/en/guide/subject-type-detection
//     // @ts-ignore
//     detectSubjectType: object => object.type
//   })
// }

// export const defaultACLObj = {
//   action: 'manage',
//   subject: 'all'
// }

// export default defineRulesFor

// abilities.js
import { AbilityBuilder, Ability } from '@casl/ability'

function defineAbilitiesFor(role, rolesPermissions) {
  const { can, build } = new AbilityBuilder(Ability)
  const permissions = rolesPermissions[role] || []
  permissions.forEach(permission => {
    switch (permission) {
      case 'GetUsers':
        can('read', 'User')
        break
      case 'AddUsers':
        can('create', 'User')
        break
      case 'UpdateUser':
        can('update', 'User')
        break
      case 'DeleteUser':
        can('delete', 'User')
        break
      case 'ResetPasswordUser':
        can('update', 'User', 'password')
        break
      case 'GetStudentsCourse':
        can('read', 'StudentCourse')
        break
      case 'UpdateStudentsCourse':
        can('update', 'StudentCourse')
        break
      case 'GetTeachersCourse':
        can('read', 'TeacherCourse')
        break
      case 'UpdateTeachersCourse':
        can('update', 'TeacherCourse')
        break
      case 'GetContracts':
        can('read', 'Contract')
        break
      case 'ManageEvents':
        can('manage', 'Event')
        break
      case 'GetEvents':
        can('read', 'Event')
        break
      case 'GetStudentsAttendance':
        can('read', 'StudentAttendance')
        break
      case 'UpdateStudentsAttendance':
        can('update', 'StudentAttendance')
        break
      case 'GetTeachersAttendance':
        can('read', 'TeacherAttendance')
        break
      case 'UpdateTeachersAttendance':
        can('update', 'TeacherAttendance')
        break
      case 'InsertUpdateStudentsReports':
        can('create', 'StudentReport')
        can('update', 'StudentReport')
        break
      case 'GetStudentsReports':
        can('read', 'StudentReport')
        break
      case 'ApproveReports':
        can('approve', 'Report')
        break
      case 'ManagePayrolls':
        can('manage', 'Payroll')
        break
      case 'ManageBooks':
        can('manage', 'Book')
        break
      case 'DeleteSchoolData':
        can('delete', 'SchoolData')
        break
      case 'ResetData':
        can('delete', 'Data')
        break
      case 'ManagePermissions':
        can('manage', 'Permission')
        break
      case 'ManageCourseSchedule':
        can('manage', 'CourseSchedule')
        break
      case 'ManageEventTypes':
        can('manage', 'EventType')
        break
      case 'ManageFile':
        can('manage', 'File')
        break
      case 'DeleteFile':
        can('delete', 'File')
        break
      case 'ManageAttendanceStatus':
        can('manage', 'AttendanceStatus')
        break
      case 'AddStudentAttendance':
        can('create', 'StudentAttendance')
        break
      case 'GetCourse':
        can('read', 'Course')
        break
      case 'AddCourse':
        can('create', 'Course')
        break
      case 'putCourse':
        can('update', 'Course')
        break
      case 'DeleteCourse':
        can('delete', 'Course')
        break
      case 'ManageStudentsToCourses':
        can('manage', 'StudentsToCourses')
        break
      case 'ManageLocations':
        can('manage', 'Location')
        break
      case 'ManageRoom':
        can('manage', 'Room')
        can('manage', 'calendar')
        break
      case 'ManageExcelMigration':
        can('manage', 'ExcelMigration')
        break
      case 'GetEmployee':
        can('read', 'Employee')
        break
      case 'GetSecretary':
        can('read', 'Secretary')
        break
      case 'GetTeacher':
        can('read', 'Teacher')
        break
      case 'GetParent':
        can('read', 'Parent')
        break
      case 'ManageWorkContract':
        can('manage', 'WorkContract')
        break
      case 'ExportReport':
        can('export', 'Report')
        break
      case 'ManageSchoolInfo':
        can('manage', 'SchoolInfo')
        break
      case 'ManageChildren':
        can('manage', 'Children')
      case 'ShowParentInfo':
        can('read', 'ParentInfo')
        break
      default:
        break
    }
  })
  return build()
}

export default defineAbilitiesFor
