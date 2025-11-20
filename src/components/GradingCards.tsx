import { useGradingStore } from '@/stores/gradingStore'; 
 import { GradingItem } from '@/types'; 
 import { useState } from 'react'; 
 import AddQuestionForm from './AddQuestionForm'; 
 
 interface GradingCardProps { 
   item: GradingItem; 
   index: number; 
   isSelected: boolean; 
   onClick: () => void; 
   onDelete: () => void; 
 } 
 
 function StatusIndicator({ item }: { item: GradingItem }) { 
   const allStepsHaveAcceptability = item.answer_steps?.every(
    (step) => !!step.analysis_acceptability
  );
   const fields = [ 
     { name: '实际是否正确', value: item.actual_is_correct === '正确' }, 
     { name: '实际题目类型', value: item.actual_question_type === '客观' || item.actual_question_type === '主观' }, 
     { name: '解析可接受度', value: allStepsHaveAcceptability }, 
   ]; 
 
   return ( 
     <div className="absolute top-1 right-1 flex items-center space-x-1"> 
       {fields.map((field, index) => ( 
         <div 
           key={index} 
           className={`w-2.5 h-2.5 rounded-full ${field.value ? 'bg-green-500' : 'bg-gray-300'}`} 
           title={`${field.name}: ${field.value ? '已填写' : '未填写'}`} 
         /> 
       ))} 
     </div> 
   ); 
 } 
 
 function GradingCard({ item, index, isSelected, onClick, onDelete }: GradingCardProps) { 
   const firstStep = item.answer_steps?.[0];
   const questionTypeText = item.question_type === 'objective' ? '客观题' : 
                            item.question_type === 'subjective' ? '主观题' : '未知类型'; 
 
   return ( 
     <div 
       className={`rounded-lg p-3 cursor-pointer transition-all duration-300 border-2 relative h-32 overflow-hidden 
         ${firstStep?.is_correct ? 'border-l-4 border-green-500 shadow-green-100' : 'border-l-4 border-red-500 shadow-red-100'} 
         ${isSelected ? 'bg-blue-100 border-blue-500 shadow-lg transform -translate-y-1' : 'bg-white border-gray-200 hover:shadow-md hover:-translate-y-0.5'}`} 
       onClick={onClick} 
     > 
       <StatusIndicator item={item} /> 
       <div className="flex justify-between items-center mb-2"> 
         <div className="flex items-center gap-2"> 
           <div className="font-bold text-gray-700">{item.question_number}</div> 
           {item.isAdded && ( 
             <button 
               onClick={(e) => { 
                 e.stopPropagation(); 
                 onDelete(); 
               }} 
               className="text-red-500 hover:text-red-700 text-xs" 
             > 
               删除 
             </button> 
           )} 
         </div> 
         <div className={`px-2 py-1 rounded-full text-xs font-bold ${ 
           firstStep?.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' 
         }`}> 
           {firstStep?.is_correct ? '正确' : '错误'} 
         </div> 
       </div> 
       
       <div className="text-gray-600 text-sm"> 
         <div className="font-medium text-gray-700 mb-1 px-1 py-0.5 bg-gray-50 rounded inline-block text-xs"> 
           题目类型: {questionTypeText} 
         </div> 
         <div className="font-bold text-gray-700 line-clamp-2 break-words"> 
           学生答案: {firstStep?.student_answer} 
         </div> 
       </div> 
       
       {firstStep?.analysis && ( 
         <div className="absolute bottom-2 right-3 text-blue-600 text-xs"> 
           展开 
         </div> 
       )} 
     </div> 
   ); 
 } 
 
 export default function GradingCards() { 
   const { data, selectedCardIndex, selectCard, addQuestion, deleteQuestion } = useGradingStore(); 
   const [isModalOpen, setIsModalOpen] = useState(false); 
 
   const handleAddQuestion = (newQuestion: any) => { 
     addQuestion(newQuestion); 
     setIsModalOpen(false); 
   }; 
 
   if (!data) { 
     return ( 
       <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm p-4 text-center text-red-500"> 
         ctrl or command + V 复制数据 
       </div> 
     ); 
   } 
 
   return ( 
     <div className="h-full bg-white rounded-lg shadow-sm p-4 overflow-y-auto"> 
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"> 
         {data.map((item, index) => ( 
           <GradingCard 
             key={index} 
             item={item} 
             index={index} 
             isSelected={selectedCardIndex === index} 
             onClick={() => selectCard(index)} 
             onDelete={() => deleteQuestion(index)} 
           /> 
         ))} 
         <div 
           className="bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:shadow-md flex items-center justify-center h-32" 
           onClick={() => setIsModalOpen(true)} 
         > 
           <div className="text-gray-500 text-2xl">+</div> 
         </div> 
       </div> 
       {isModalOpen && ( 
         <AddQuestionForm 
           onAdd={handleAddQuestion} 
           onCancel={() => setIsModalOpen(false)} 
         /> 
       )} 
     </div> 
   ); 
 }